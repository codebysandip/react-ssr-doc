import "@bahmutov/cypress-code-coverage/support";
import "assets/scss/styles.scss";
import { configureHttpClient } from "src/core/functions/configure-http-client.js";
import "./commands.js";
import { setUp } from "./setup.js";

configureHttpClient();

Cypress.Commands.add("mount", setUp);
