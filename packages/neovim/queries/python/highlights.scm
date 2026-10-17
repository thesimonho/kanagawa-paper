; extends

; Capture type leaves, not whole regions: calls inside Annotated metadata must
; not overlap an italic capture. Declaration contexts are handled separately.
((type [(identifier) @type.annotation (attribute attribute: (identifier) @type.annotation)]) @_type
  (#not-has-parent? @_type type_alias_statement type_parameter)
  (#set! priority 110))

((type (generic_type [(identifier) @type.annotation (attribute attribute: (identifier) @type.annotation)])) @_type
  (#not-has-parent? @_type type_alias_statement)
  (#set! priority 110))

((type (generic_type (type_parameter
  (type [(identifier) @type.annotation (attribute attribute: (identifier) @type.annotation)])))) @_type
  (#not-has-parent? @_type type_alias_statement)
  (#set! priority 110))

(type_alias_statement right: (type [(identifier) @type.annotation (attribute attribute: (identifier) @type.annotation)])
  (#set! priority 110))

(type_alias_statement right: (type (generic_type [(identifier) @type.annotation (attribute attribute: (identifier) @type.annotation)]))
  (#set! priority 110))

(type_alias_statement right: (type (generic_type (type_parameter
  (type [(identifier) @type.annotation (attribute attribute: (identifier) @type.annotation)]))))
  (#set! priority 110))

; Forward-reference string pieces exclude executable interpolation expressions.
((type (string [(string_start) (string_content) (string_end)] @type.annotation))
  (#set! priority 110))

((type (none) @type.annotation)
  (#set! priority 110))

((type_parameter ["[" "]"] @type.annotation)
  (#set! priority 110))

([
  (class_definition name: (identifier) @type.declaration)
  (type_alias_statement left: (type (identifier) @type.declaration))
  (type_alias_statement left: (type (generic_type (identifier) @type.declaration)))
  (type_alias_statement left: (type (generic_type (type_parameter (type (identifier) @type.declaration)))))
  (class_definition type_parameters: (type_parameter (type (identifier) @type.declaration)))
  (function_definition type_parameters: (type_parameter (type (identifier) @type.declaration)))
]
  (#set! priority 111))
