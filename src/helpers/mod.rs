pub fn capitalize(s: &str) -> String {
  let mut c = s.chars();
  match c.next() {
    None => String::new(),
    Some(f) => f.to_uppercase().chain(c).collect(),
  }
}

pub fn kebab_to_camel(item: &str) -> String {
  let v: Vec<_> = item
    .split('-')
    .enumerate()
    .map(|(idx, item)| {
      if idx == 0 {
        item.to_string()
      } else {
        capitalize(item)
      }
    })
    .collect();
  v.join("")
}

#[cfg(test)]
mod tests {
  use super::*;
  use proptest::proptest;

  #[test]
  fn test_capitalize() {
    assert_eq!(capitalize("test"), "Test".to_string());
  }

  #[test]
  fn test_kebab_to_camel() {
    assert_eq!(
      kebab_to_camel("test-case-string"),
      "testCaseString".to_string()
    );
  }

  proptest! {
      #[test]
      fn capitalize_idempotent(s in "[a-z]{1,10}") {
          let result = capitalize(&s);

          assert_eq!(
              result,
              capitalize(result.as_str())
          )
      }
  }
}
