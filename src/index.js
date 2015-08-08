"use strict";
import db from "./modules/database";

let chopstick = {};
chopstick.db = require("./modules/database");

window.chopstick = window.chopstick || chopstick;
