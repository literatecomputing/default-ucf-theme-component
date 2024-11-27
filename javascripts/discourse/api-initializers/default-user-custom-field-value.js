import EmberObject, { set}  from "@ember/object"; // Import EmberObject here
import { dasherize } from "@ember/string";
import { isEmpty } from "@ember/utils";
import { apiInitializer } from "discourse/lib/api";
import discourseComputed from "discourse-common/utils/decorators";

export default apiInitializer("1.8.0", (api) => {
  const userFieldId = 8;
  const userFieldVal = "Bronze";

  api.modifyClass("component:user-card-contents", {
    pluginId: "discourse-default-user-custom-fields",
    @discourseComputed("user.user_fields.@each.value")
    publicUserFields() {
      // Custom logic here
      const siteUserFields = this.site.get("user_fields");
      if (!isEmpty(siteUserFields)) {
        const userFields = this.get("user.user_fields");
        if (userFields[userFieldId] == null) {
          userFields[userFieldId] = userFieldVal
        }
        return siteUserFields
          .filterBy("show_on_user_card", true)
          .sortBy("position")
          .map((field) => {
            set(field, "dasherized_name", dasherize(field.get("name")));
            const value = userFields ? userFields[field.get("id")] : null;
            return isEmpty(value) ? null : EmberObject.create({ value, field });
          })
          .compact();
      }
    },
  });

  // Modify User controller
  api.modifyClass("controller:user", {
    pluginId: "discourse-default-user-custom-fields",

    @discourseComputed("model.user_fields.@each.value")
    publicUserFields() {
      const siteUserFields = this.site.get("user_fields");

      if (!isEmpty(siteUserFields)) {
        const userFields = this.get("model.user_fields");
        if (userFields[userFieldId] == null) {
          userFields[userFieldId] =  userFieldVal;
        }
        return siteUserFields
          .filterBy("show_on_profile", true)
          .sortBy("position")
          .map((field) => {
            set(field, "dasherized_name", dasherize(field.get("name")));
            const value = userFields
              ? userFields[field.get("id").toString()]
              : null;
            return isEmpty(value) ? null : EmberObject.create({ value, field });
          })
          .compact();
      }
    },
  });
});
