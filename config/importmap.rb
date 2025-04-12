# Pin npm packages by running ./bin/importmap

pin "application"
pin "@rails/actioncable", to: "@rails--actioncable.js" # @8.0.200
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin "square"
pin_all_from "app/javascript/channels", under: "channels"
pin_all_from "app/javascript/controllers", under: "controllers"
