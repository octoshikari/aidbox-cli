.PHONY: lint
install-watch:
	cargo install cargo-watch

watch:
	cargo watch -x run

release:
	cargo build --release

run: release
	./target/release/aidbox-cli

add-clippy:
	rustup component add clippy
lint:
	cargo clippy