# Default User Custom Field Value

**Make a User Custom Field have a default value (proof of concept) **

This sets a single user field, specified by theme setting `user_field_id`, to the value in theme setting `default_field_value`. A more robust solution would have this setting be an array to have defaults for many settings, but that wasn't needed, so it's not (yet?) implemented.

A cleaner design would override with class syntax and call `super` after filling in the default, so core's own field-rendering logic is reused instead of copied — the copied logic is what went stale in 2026. The acceptance tests exist to catch that.

The other solution would be a plugin that set defaults on custom fields when a user was created and/or had a job that created some default value if none existed. An advantage of this solution is that changing the default value is easy since it doesn't actually exist, where a plugin would need to update all user custom field if there was a change.
