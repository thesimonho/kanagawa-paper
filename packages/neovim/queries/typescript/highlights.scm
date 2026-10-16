; extends

; Syntax type nodes exclude runtime identifiers such as Object in Object.values().
([
  (type_identifier)
  (predefined_type)
] @type.annotation
  (#set! priority 110))

; Declaration names are landmarks, even though they use the same type node.
([
  (type_alias_declaration name: (type_identifier) @type.definition)
  (interface_declaration name: (type_identifier) @type.definition)
  (class_declaration name: (type_identifier) @type.definition)
  (abstract_class_declaration name: (type_identifier) @type.definition)
  (type_parameter name: (type_identifier) @type.definition)
]
  (#set! priority 111))
