import { apiInitializer } from "discourse/lib/api";
import discourseComputed, { on } from "discourse-common/utils/decorators";
import { set } from "@ember/object"; // <-- Import set function here
import { dasherize } from "@ember/string";
import EmberObject from "@ember/object"; // Import EmberObject here
import UserCardContents from "discourse/components/user-card-contents";
import { isEmpty } from "@ember/utils";

export default apiInitializer("1.8.0", ( api ) => {
  console.log("hello world from api initializer!");


  api.modifyClass("component:user-card-contents", {
    pluginId: "discourse-default-user-custom-fields",
    @discourseComputed("user.user_fields.@each.value")
    publicUserFields() {
      // Custom logic here
      console.log("hello world from publicUserFields in my theme component!");
      const siteUserFields = this.site.get("user_fields");
      if (!isEmpty(siteUserFields)) {
        console.log("got site user fields!", siteUserFields);
        const userFields = this.get("user.user_fields");
        // if [userfields[1] is null make it a default strring
        if (userFields[1] == null) {
          userFields[1] = "I am not important";
        }
        console.log("got user fields!", userFields);
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
    }
  });  

// Modify User controller
  api.modifyClass("controller:user", {
    pluginId: "discourse-default-user-custom-fields",

    @discourseComputed("model.user_fields.@each.value")
    publicUserFields() {
      console.log("Overriding publicUserFields in User controller...");
      const siteUserFields = this.site.get("user_fields");

      if (!isEmpty(siteUserFields)) {
        const userFields = this.get("model.user_fields");
        if (userFields[1] == null) {
          userFields[1] = "I am not important";
        }
        console.log("got user fields!", userFields);
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
