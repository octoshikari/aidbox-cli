mod app;
mod front;

use clap::{ArgMatches, Command};
use std::{error::Error, io, sync::mpsc, thread, time::Duration};
use termion::{
  event::Key,
  input::{MouseTerminal, TermRead},
  raw::IntoRawMode,
  screen::AlternateScreen,
};
use tui::{
  backend::{Backend, TermionBackend},
  Terminal,
};

use self::app::App;

pub fn commands() -> Command<'static> {
  return Command::new("ui").about("Aidbox UI console");
}

pub fn ui_run(sub_matches: &ArgMatches) {
  let stdout = io::stdout().into_raw_mode().expect("");
  let stdout = MouseTerminal::from(stdout);
  let stdout = AlternateScreen::from(stdout);
  let backend = TermionBackend::new(stdout);
  let mut terminal = Terminal::new(backend).expect("");

  let app = App::new("Aidbox UI", true);
  run_app(&mut terminal, app, Duration::new(1, 0)).expect("");
}

fn run_app<B: Backend>(
  terminal: &mut Terminal<B>,
  mut app: App,
  tick_rate: Duration,
) -> Result<(), Box<dyn Error>> {
  let events = events(tick_rate);
  loop {
    terminal.draw(|f| front::draw(f, &mut app))?;

    match events.recv()? {
      Event::Input(key) => match key {
        Key::Char(c) => app.on_key(c),
        Key::Up => app.on_up(),
        Key::Down => app.on_down(),
        Key::Left => app.on_left(),
        Key::Right => app.on_right(),
        _ => {},
      },
      Event::Tick => app.on_tick(),
    }
    if app.should_quit {
      return Ok(());
    }
  }
}

enum Event {
  Input(Key),
  Tick,
}

fn events(tick_rate: Duration) -> mpsc::Receiver<Event> {
  let (tx, rx) = mpsc::channel();
  let keys_tx = tx.clone();
  thread::spawn(move || {
    let stdin = io::stdin();
    for key in stdin.keys().flatten() {
      if let Err(err) = keys_tx.send(Event::Input(key)) {
        eprintln!("{}", err);
        return;
      }
    }
  });
  thread::spawn(move || loop {
    if let Err(err) = tx.send(Event::Tick) {
      eprintln!("{}", err);
      break;
    }
    thread::sleep(tick_rate);
  });
  rx
}
