import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { EventEmitter } from 'events';
import { RangeCompatible } from 'atom';
import { Logger } from './logging';

export class FoxDot extends EventEmitter {
	childProcess?: ChildProcessWithoutNullStreams;
	logger?: Logger;

	constructor(logger?: Logger) {
		super();

		this.logger = logger;

		const pythonPath = atom.config.get('foxdot.pythonPath') || 'python';
		const samplesDirectory = atom.config.get('foxdot.samplesDirectory');

		let command = ['-m', 'FoxDot', '--pipe'];
		if (samplesDirectory !== '') {
			logger?.service(`Using samples from ${samplesDirectory}.`, false);
			command = command.concat(['-d', samplesDirectory]);
		}

		this.childProcess = spawn(pythonPath, command);

		this.childProcess.stdout.on('data', (data) => {
			logger?.stdout(data);
		});

		this.childProcess.stderr.on('data', (data) => {
			logger?.stderr(data);
		});

		this.childProcess.on('close', (code) => {
			if (code) {
				logger?.service(`FoxDot has exited with code ${code}.`, true);
			} else {
				logger?.service('FoxDot has stopped.', false);
			}

			this.childProcess = undefined;
			this.emit('stop');
		});

		logger?.service('FoxDot has started.', false);
	}

	dispose() {
		this.childProcess?.kill();
	}

	clearClock() {
		return this.evaluateCode('Clock.clear()');
	}

	evaluateBlocks(evolve) {
		const editor = atom.workspace.getActiveTextEditor();
		if (!editor) {
			return;
		}

		const buffer = editor.getBuffer();
		const lines = buffer.getLines();
		const selectedRanges = editor.getSelectedBufferRanges();
		const ranges = selectedRanges.map((selectedRange) => {
			if (!selectedRange.isEmpty()) {
				return selectedRange;
			}

			const row = selectedRange.start.row;

			let rowBefore = row;
			while (rowBefore >= 0 && lines[rowBefore] !== '') {
				--rowBefore;
			}

			let rowAfter = row;
			while (rowAfter < lines.length && lines[rowAfter] !== '') {
				++rowAfter;
			}

			const range: RangeCompatible = [
				[rowBefore + 1, 0],
				[rowAfter, 0],
			];
			return buffer.clipRange(range);
		});

		return this.evaluateRanges(ranges, evolve);
	}

	evaluateCode(code: string) {
		if (!this.childProcess) {
			return;
		}

		const stdin = this.childProcess.stdin;
		stdin.write(code);
		stdin.write('\n\n');

		this.logger?.stdin(code);
	}

	evaluateFile() {
		const editor = atom.workspace.getActiveTextEditor();
		if (!editor) {
			return;
		}

		const range = editor.getBuffer().getRange();
		return this.evaluateRange(range, evolve);
	}

	evaluateLines() {
		const editor = atom.workspace.getActiveTextEditor();
		if (!editor) {
			return;
		}

		const buffer = editor.getBuffer();
		const positions = editor.getCursorBufferPositions();
		const ranges = positions.map((position) => {
			const row = position.row;
			return buffer.rangeForRow(row, true);
		});
		return this.evaluateRanges(ranges, evolve);
	}

	evaluateRange(range: RangeCompatible, evolve) {
		const editor = atom.workspace.getActiveTextEditor();
		if (!editor) {
			return;
		}

		const buffer = editor.getBuffer();

		const marker = editor.markBufferRange(range);
		editor.decorateMarker(marker, {
			class: 'foxdot-flash',
			type: 'highlight',
		});
		setTimeout(() => {
			marker.destroy();
		}, 300);

		const code = buffer.getTextInRange(range);
		if (evolve) {
			let evolution = this.applyEvolution(code)
			editor.insertText(evolution)
		}
		else {
				this.evaluateCode(code);
		}
	}

	evaluateRanges(ranges: RangeCompatible[], evolve) {
		return ranges.forEach((range) => this.evaluateRange(range,evolve));
	}
	evolve() {
		let evolve = true;
		this.evaluateBlocks(evolve);
	}
	applyEvolution(code: string) {
			code = '# evolved it: \np1 >> pluck([3,4,7])'
			return code;
	}
}
