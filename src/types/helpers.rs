use serde_json::Value;
use std::collections::HashMap;

pub fn convert_primitive(val: &str) -> String {
    if val == "zen/string" {
        String::from("string")
    } else if val == "zen/boolean" {
        String::from("boolean")
    } else if val == "zen/date" || val == "zen/datetime" {
        String::from("string")
    } else if val == "zen/number" || val == "zen/integer" {
        String::from("number")
    } else {
        String::from("any")
    }
}

pub fn normalize_confirms(confirms: &[String], resource_name: &str) -> Option<Vec<String>> {
    return if confirms.is_empty()
        || (confirms.len() == 1 && confirms.get(0).unwrap().as_str() == resource_name)
    {
        None
    } else {
        Some(
            confirms
                .iter()
                .filter(|item| item.as_str() != resource_name)
                .map(|item| item.to_string())
                .collect(),
        )
    };
}

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

pub fn zen_path_to_name(def: &Value) -> String {
    let v: Vec<&str> = def.as_str().unwrap().split('/').collect();

    if v[1] != "schema" {
        return kebab_to_camel(v[1]);
    }
    return if !v[0].is_empty() {
        let ns_parts: Vec<_> = v[0].split('.').collect();
        kebab_to_camel(ns_parts.last().unwrap())
    } else {
        "unknown-name".to_string()
    };
}

pub fn get_name(element: HashMap<String, Value>) -> String {
    if element.get("zen.fhir/type").is_some() {
        return element
            .get("zen.fhir/type")
            .unwrap()
            .as_str()
            .unwrap()
            .to_string();
    }
    if element.get("resourceType").is_some() {
        return element
            .get("resourceType")
            .unwrap()
            .as_str()
            .unwrap()
            .to_string();
    }
    return zen_path_to_name(element.get("zen/name").unwrap());
}

#[cfg(test)]
mod tests {
    use super::*;

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
}
