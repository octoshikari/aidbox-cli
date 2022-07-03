import { createEvent, createStore } from "effector";
import { persist } from "effector-storage/local";

export const navbarToggle = createEvent();

export const $isNavbarOpened = createStore<boolean>(false)
  .on(navbarToggle, (current) => !current);

persist({ store: $isNavbarOpened });
