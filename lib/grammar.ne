@builtin "number.ne"
@builtin "whitespace.ne"
@builtin "string.ne"

start -> player  | pattributes
player -> pname ">>" ptype "(" array:? ")"

pattributes -> pname "." pattribute "=" array | pname "." pattribute "=" element

array -> "[" element ("," element):* "]" {% storeArrays %}

element ->  int:+
			| decimal:+ {% (d) => {return d[0];} %}
			| int:+ "/" int:+ {% (d) =>  {return d[0] / d[2]; } %}

pname -> string int {% (d) => { return d[0] + d[1];} %}

pattribute -> string {% concatChars %}

ptype -> string {% concatChars %}

string -> [a-zA-Z]:+


@{%

function concatChars(d){
	let e ='';
	return d[0][0].join('');
}

function storeArrays(d){
	let e = []
	return recurseLeaf(d, [] ) ;

}

function recurseLeaf(d,e) {
	for (let i=0;i<d.length;i++){
		if(typeof d[i] == 'number')
			e.push(d[i])
		else if(Array.isArray(d[i]))
			recurseLeaf(d[i],e)

	}
	return e;
}



%}
