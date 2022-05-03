use crate::types::cache::{Cache, TypeElement, TypeElementPart};
use crate::types::r#box::BoxInstance;
use indicatif::{ProgressBar, ProgressStyle};
use log::info;
use std::collections::HashMap;
use std::error::Error;
use std::thread;
use std::time::Duration;

pub async fn generate_types(box_instance: BoxInstance, cache: Cache) -> Result<(), Box<dyn Error>> {
    info!("Start load symbols...");
    let symbols = match box_instance
        .load_all_symbols(cache.cache_enabled, &cache.cache_path)
        .await
    {
        Ok(it) => it,
        Err(err) => return Err(err),
    };
    let pb = ProgressBar::new(symbols.len() as u64);
    pb.set_style(
        ProgressStyle::with_template(
            "{spinner:.green} [{elapsed_precise}] [{bar:60.cyan/red}] ({pos}/{len})",
        )
        .unwrap()
        .progress_chars("#>-"),
    );

    for element in symbols.iter() {
        pb.inc(1);
        thread::sleep(Duration::from_millis(5));
    }

    pb.finish();
    info!(
        "Symbols processed in {:?}s",
        (pb.elapsed().as_secs_f64() * 100f64).floor() / 100f64
    );

    let mut types = HashMap::new();
    types.insert(
        "test".to_string(),
        TypeElement {
            name: "test".to_string(),
            element: TypeElementPart {
                description: Some("test".to_string()),
            },
        },
    );

    match cache.save_intermediate_types(types) {
        _ => {}
    }

    match cache.save() {
        _ => {}
    }

    Ok(())
}

/*
export const generateTypes = async (
  box: Box,
  cache: Cache,
  includeProfile: boolean,
): Promise<Types> => {
  const result = [];
  for (const [idx, symbol] of Object.entries(symbols)) {
    const definition = await parseSymbol(box, cache, symbol, includeProfile);

    if (definition) {
      result.push(definition);
    }
  }

  const finalResult = result.reduce(
    (accumulator: Types, current: TypesElement) => {
      const { name, ...rest } = current;
      if (accumulator[name]) {
        if (rest.source) {
          return {
            ...accumulator,
            [name]: merge<TypesElementPart[]>(rest, accumulator[name]),
          };
        } else {
          return {
            ...accumulator,
            [name]: merge<TypesElementPart[]>(accumulator[name], rest),
          };
        }
      }
      return { ...accumulator, [name]: rest };
    },
    {},
  );
  cache.saveIntermediateTypes(finalResult);
  return finalResult;
};


*/
