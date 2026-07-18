# Default User Custom Field Value

**Make a User Custom Field have a default value (proof of concept) **

This sets a single user field, specified by theme setting `user_field_id`, to the value in theme setting `default_field_value`. A more robust solution would have this setting be an array to have defaults for many settings, but that wasn't needed, so it's not (yet?) implemented.

It might be better if it called `super()` and/or just updated `this.site.get("user_fields")` rather than overriding anything.

The other solution would be a plugin that set defaults on custom fields when a user was created and/or had a job that created some default value if none existed. An advantage of this solution is that changing the default value is easy since it doesn't actually exist, where a plugin would need to update all user custom field if there was a change.
