use itertools::Itertools;
use std::collections::HashMap;

use serde::{Deserialize, Serialize};

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

#[derive(Serialize, Deserialize, Clone, Eq, PartialEq, Debug)]
pub struct Element {
  pub is_rpc: bool,
  pub rpc_method: Option<String>,
  pub description: Option<String>,
  pub profile: bool,
  pub extends: Option<Vec<String>>,
  pub plain: Option<String>,
  pub schema: Option<HashMap<String, ElementSchema>>,
  pub values: Option<Vec<String>>,
}

#[derive(Serialize, Clone, Eq, PartialEq, Deserialize, Debug)]
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

pub fn deep_merge_element_schema(
  left: HashMap<String, ElementSchema>,
  right: HashMap<String, ElementSchema>,
) -> HashMap<String, ElementSchema> {
  if left == right {
    right
  } else {
    let mut new_result: HashMap<String, ElementSchema> = left.clone();
    let mut left_keys = left.keys();
    let right_keys = right.keys();

    let difference: Vec<_> = right_keys
      .into_iter()
      .filter(|item| !left_keys.contains(item))
      .map(String::from)
      .collect();

    for (key, value) in left {
      match right.get(key.as_str()).is_some() {
        true => {
          let element = right.get(key.as_str()).unwrap().to_owned();
          if value == element {
            new_result.insert(key, value);
          } else {
            let merged_types = match element.sub_type.is_some() {
              true => match value.sub_type.is_some() {
                true => Some(deep_merge_element_schema(
                  value.sub_type.clone().unwrap(),
                  element.sub_type.clone().unwrap(),
                )),
                false => value.sub_type.clone(),
              },
              false => value.sub_type.clone(),
            };

            new_result.insert(
              key,
              ElementSchema {
                description: element.description,
                require: element.require,
                sub_type: merged_types,
                plain_type: element.plain_type,
                extends: element.extends,
                is_array: element.is_array,
                is_reference: element.is_reference,
                values: match value.values {
                  Some(it) => match element.values {
                    Some(ri) => {
                      let values = [it.as_slice(), ri.as_slice()]
                        .concat()
                        .iter()
                        .unique()
                        .map(String::to_string)
                        .collect();
                      Some(values)
                    },
                    None => element.values,
                  },
                  None => element.values,
                },
              },
            );
          }
        },
        false => {
          new_result.insert(key, value);
        },
      }
    }

    for key in difference {
      let value = right.get(key.as_str()).unwrap().to_owned();
      new_result.insert(key, value);
    }
    new_result
  }
}
