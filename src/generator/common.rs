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
  pub source: bool,
  pub profile: bool,
  pub extends: Option<Vec<String>>,
  pub schema: ElementType,
}

impl Element {
  pub fn new(
    description: Option<String>,
    source: bool,
    profile: bool,
    extends: Option<Vec<String>>,
    schema: ElementType,
  ) -> Self {
    Self {
      description,
      source,
      profile,
      extends,
      schema,
    }
  }
}

#[derive(Serialize, Clone, Eq, PartialEq, Debug)]
pub struct ElementType {
  pub description: Option<String>,
  pub sub_type: Option<HashMap<String, String>>,
  pub plain_type: Option<String>,
}

impl ElementType {
  pub fn new(
    description: Option<String>,
    sub_type: Option<HashMap<String, String>>,
    plain_type: Option<String>,
  ) -> Self {
    Self {
      description,
      sub_type,
      plain_type,
    }
  }
}

// #[derive(Serialize, Clone, Eq, PartialEq, Debug)]
// pub struct TypeElementSubType {
//   pub description: Option<String>,
//   pub require: bool,
//   pub sub_type: Option<HashMap<String, TypeElementSubType>>,
//   pub plain_type: Option<String>,
//   pub extends: Option<Vec<String>>,
//   pub array: bool,
// }
