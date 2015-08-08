"use strict";
import db from "./modules/database";

let chopstick = {};
chopstick.db = db;

window.chopstick = window.chopstick || chopstick;
