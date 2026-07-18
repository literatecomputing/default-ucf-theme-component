import EmberObject, { computed, set } from "@ember/object"; // Import EmberObject here
import { dasherize } from "@ember/string";
import { isEmpty } from "@ember/utils";
import { apiInitializer } from "discourse/lib/api";

export default apiInitializer((api) => {
  const userFieldId = settings.user_field_id;
  const userFieldVal = settings.default_field_value;

  api.modifyClass("component:user-card-contents", {
    pluginId: "discourse-default-user-custom-fields",
    publicUserFields: computed("user.user_fields.@each.value", function () {
      // Custom logic here
      const siteUserFields = this.site.get("user_fields");
      if (!isEmpty(siteUserFields)) {
        const userFields = this.get("user.user_fields");
        if (userFields[userFieldId] == null) {
          userFields[userFieldId] = userFieldVal;
        }
        return siteUserFields
          .filter((field) => field.get("show_on_user_card"))
          .sort((a, b) => a.get("position") - b.get("position"))
          .map((field) => {
            set(field, "dasherized_name", dasherize(field.get("name")));
            const value = userFields ? userFields[field.get("id")] : null;
            return isEmpty(value) ? null : EmberObject.create({ value, field });
          })
          .filter(Boolean);
      }
    }),
  });

  // Modify User controller
  api.modifyClass("controller:user", {
    pluginId: "discourse-default-user-custom-fields",

    publicUserFields: computed("model.user_fields.@each.value", function () {
      const siteUserFields = this.site.get("user_fields");

      if (!isEmpty(siteUserFields)) {
        const userFields = this.get("model.user_fields");
        if (userFields[userFieldId] == null) {
          userFields[userFieldId] = userFieldVal;
        }
        return siteUserFields
          .filter((field) => field.get("show_on_profile"))
          .sort((a, b) => a.get("position") - b.get("position"))
          .map((field) => {
            set(field, "dasherized_name", dasherize(field.get("name")));
            const value = userFields
              ? userFields[field.get("id").toString()]
              : null;
            return isEmpty(value) ? null : EmberObject.create({ value, field });
          })
          .filter(Boolean);
      }
    }),
  });
});
