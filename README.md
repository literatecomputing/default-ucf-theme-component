# Default User Custom Field Value

**Make a User Custom Field have a default value (proof of concept) **

This sets user_custom_field_1 to "I am not important" if it is null.

To be useful, settings would determine which field was given a default value and what the value would be. To be really useful, it would do it for an arbitray number of custom user fields.

Also, it would be better to move the code like

```
        // if [userfields[1] is null make it a default strring
        if (userFields[1] == null) {
          userFields[1] = "I am not important";
        }
        console.log("got user fields!", userFields);
```

into a function so that it could be called in both places.

It might be better if it called `super()` and/or just updated `this.site.get("user_fields")` rather than overriding anything.

The other solution would be a plugin that set defaults on custom fields when a user was created and/or had a job that created some default value if none existed. An advantage of this solution is that changing the default value is easy since it doesn't actually exist, where a plugin would need to update all user custom field if there was a change.
