use std::collections::HashMap;

use serde::Serialize;

#[derive(Serialize, Clone, Eq, PartialEq, Debug)]
pub struct ElementWrapper {
  pub name: String,
  pub element: Element,
}

impl ElementWrapper {
  pub fn new(name: String, element: Element) -> Self {
    Self { name, element }
  }
}

#[derive(Serialize, Clone, Eq, PartialEq, Debug)]
pub struct Element {
  pub description: Option<String>,
  pub profile: bool,
  pub extends: Option<Vec<String>>,
  pub schema: Option<HashMap<String, ElementSchema>>,
}

impl Element {
  pub fn new(
    description: Option<String>,
    profile: bool,
    extends: Option<Vec<String>>,
    schema: Option<HashMap<String, ElementSchema>>,
  ) -> Self {
    Self {
      description,
      profile,
      extends,
      schema,
    }
  }
}

#[derive(Serialize, Clone, Eq, PartialEq, Debug)]
pub struct ElementSchema {
  pub extends: Option<Vec<String>>,
  pub is_array: bool,
  pub is_reference: bool,
  pub require: bool,
  pub description: Option<String>,
  pub sub_type: Option<HashMap<String, ElementSchema>>,
  pub plain_type: Option<String>,
  pub values: Option<Vec<String>>,
}

impl ElementSchema {
  pub fn new(
    is_array: bool,
    is_reference: bool,
    require: bool,
    description: Option<String>,
    sub_type: Option<HashMap<String, ElementSchema>>,
    plain_type: Option<String>,
    values: Option<Vec<String>>,
    extends: Option<Vec<String>>,
  ) -> Self {
    Self {
      is_array,
      require,
      is_reference,
      description,
      sub_type,
      plain_type,
      values,
      extends,
    }
  }
}
