import { click, visit } from "@ember/test-helpers";
import { test } from "qunit";
import { cloneJSON } from "discourse/lib/object";
import userFixtures from "discourse/tests/fixtures/user-fixtures";
import { acceptance } from "discourse/tests/helpers/qunit-helpers";

acceptance("Default User Custom Field Value", function (needs) {
  needs.user();

  // ids 1 and 8 cover the setting's default and a typical customized value
  needs.site({
    user_fields: [
      {
        id: 1,
        name: "Field One",
        show_on_profile: true,
        show_on_user_card: true,
        position: 1,
      },
      {
        id: 8,
        name: "Field Eight",
        show_on_profile: true,
        show_on_user_card: true,
        position: 2,
      },
    ],
  });

  needs.pretender((server, helper) => {
    const cardResponse = cloneJSON(userFixtures["/u/charlie/card.json"]);
    cardResponse.user.user_fields = {};
    server.get("/u/charlie/card.json", () => helper.response(cardResponse));

    const profileResponse = cloneJSON(userFixtures["/u/eviltrout.json"]);
    // null, not {} — users who never filled in any field serialize this way
    profileResponse.user.user_fields = null;
    server.get("/u/eviltrout.json", () => helper.response(profileResponse));
  });

  test("user card shows the default custom field value", async function (assert) {
    await visit("/t/internationalization-localization/280");
    await click(".topic-map__users-trigger");
    await click('a[data-user-card="charlie"]');

    assert
      .dom(".user-card .public-user-field")
      .exists({ count: 1 }, "only the defaulted field is shown");
  });

  test("user profile fills in the default custom field value", async function (assert) {
    await visit("/u/eviltrout");

    const fields = this.owner.lookup("controller:user").get("publicUserFields");
    assert.strictEqual(fields.length, 1, "only the defaulted field is present");
    assert.true(!!fields[0].get("value"), "default value is filled in");
  });
});
