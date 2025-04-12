import "@hotwired/turbo-rails";
import "channels";
import "controllers";
import { initializeSquare } from "square";

document.addEventListener("turbo:load", function () {
  initializeSquare();
});
