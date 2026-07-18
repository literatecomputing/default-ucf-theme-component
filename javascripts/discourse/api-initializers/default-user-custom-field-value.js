import EmberObject, { computed, set } from "@ember/object";
import { dasherize } from "@ember/string";
import { isEmpty } from "@ember/utils";
import { apiInitializer } from "discourse/lib/api";

export default apiInitializer((api) => {
  const userFieldId = settings.user_field_id;
  const userFieldVal = settings.default_field_value;

  function publicUserFieldsWithDefault(site, userFields, showKey) {
    const siteUserFields = site.get("user_fields");
    if (isEmpty(siteUserFields)) {
      return;
    }
    userFields = userFields || {};
    if (userFields[userFieldId] == null) {
      userFields[userFieldId] = userFieldVal;
    }
    return siteUserFields
      .filter((field) => field.get(showKey))
      .sort((a, b) => a.get("position") - b.get("position"))
      .map((field) => {
        set(field, "dasherized_name", dasherize(field.get("name")));
        const value = userFields[field.get("id").toString()];
        return isEmpty(value) ? null : EmberObject.create({ value, field });
      })
      .filter(Boolean);
  }

  api.modifyClass("component:user-card-contents", {
    pluginId: "discourse-default-user-custom-fields",
    publicUserFields: computed("user.user_fields.@each.value", function () {
      return publicUserFieldsWithDefault(
        this.site,
        this.get("user.user_fields"),
        "show_on_user_card"
      );
    }),
  });

  api.modifyClass("controller:user", {
    pluginId: "discourse-default-user-custom-fields",
    publicUserFields: computed("model.user_fields.@each.value", function () {
      return publicUserFieldsWithDefault(
        this.site,
        this.get("model.user_fields"),
        "show_on_profile"
      );
    }),
  });
});
