use log::Level;

fn level_enum(verbosity: i8) -> Option<Level> {
    match verbosity {
        i8::MIN..=-1 => None,
        0 => Some(Level::Error),
        1 => Some(Level::Warn),
        2 => Some(Level::Info),
        3 => Some(Level::Debug),
        4..=i8::MAX => Some(Level::Trace),
    }
}

pub fn log_level_filter(verbosity: i8) -> log::LevelFilter {
    level_enum(verbosity)
        .map(|l| l.to_level_filter())
        .unwrap_or(log::LevelFilter::Off)
}

pub fn set_verbosity(default: Option<Level>, quiet: i8, verbose: i8) -> i8 {
    level_value(default) - quiet + verbose
}

fn level_value(level: Option<Level>) -> i8 {
    match level {
        None => -1,
        Some(Level::Error) => 0,
        Some(Level::Warn) => 1,
        Some(Level::Info) => 2,
        Some(Level::Debug) => 3,
        Some(Level::Trace) => 4,
    }
}
