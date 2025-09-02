import {
  json,
  redirect,
  type ActionFunction,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import {
  Form,
  useFetcher,
  useLoaderData,
  useActionData,
  useRevalidator,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { query, Shareholder } from "services/db.server";

// Meta function to define page metadata (title, description, etc.)
export const meta: MetaFunction = () => {
  return [
    { title: "Remix Fullstack Data Flow" },
    { name: "description", content: "Welcome to Remix Tutorial" },
  ];
};

// Loader function that runs on the server to fetch data
export const loader: LoaderFunction = async () => {
  try {
    // Query all shareholders from the database
    const shareholders = await query<Shareholder>("SELECT * FROM shareholders");
    // Return the shareholders as JSON
    return json(shareholders);
  } catch (error) {
    console.error("Loader error:", error);
    return json([]);
  }
};

// Action function to handle form submissions (create, update, delete)
export const action: ActionFunction = async ({
  request,
}: {
  request: Request;
}) => {
  // Parse the form data from the request
  const formData = await request.formData();
  // Get the intent (action type), fn_id, name_am, and old_fn_id from the form
  const intent = formData.get("intent");
  const fn_id = formData.get("fn_id");
  const name_amharic = formData.get("name_amharic");
  const old_fn_id = formData.get("old_fn_id");
  const name_english = formData.get("name_english");
  const city = formData.get("city");
  const subcity = formData.get("subcity");
  const wereda = formData.get("wereda");
  const house_number = formData.get("house_number");
  const phone_1 = formData.get("phone_1");
  const phone_2 = formData.get("phone_2");
  const email = formData.get("email");
  const share_will = formData.get("share_will");
  const nationality = formData.get("nationality");

  // Handle different actions based on the intent
  if (intent === "create") {
    // Validate required fields
    if (!fn_id || fn_id.toString().length !== 6) {
      return json({ error: "FN ID must be 6 characters" }, { status: 400 });
    }
    if (!name_amharic || name_amharic.toString().length === 0) {
      return json({ error: "Valid name_amharic is required" }, { status: 400 });
    }
    if (!name_english || name_english.toString().length === 0) {
      return json({ error: "Valid name_english is required" }, { status: 400 });
    }
    if (!city || city.toString().length === 0) {
      return json({ error: "Valid city is required" }, { status: 400 });
    }
    if (!subcity || subcity.toString().length === 0) {
      return json({ error: "Valid subcity is required" }, { status: 400 });
    }
    if (!wereda || wereda.toString().length === 0) {
      return json({ error: "Valid wereda is required" }, { status: 400 });
    }
    if (!house_number || house_number.toString().length === 0) {
      return json({ error: "Valid house_number is required" }, { status: 400 });
    }
    if (!phone_1 || phone_1.toString().length === 0) {
      return json({ error: "Valid phone_1 is required" }, { status: 400 });
    }
    if (!phone_2 || phone_2.toString().length === 0) {
      return json({ error: "Valid phone_2 is required" }, { status: 400 });
    }
    if (!email || email.toString().length === 0) {
      return json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!share_will || isNaN(Number(share_will))) {
      return json({ error: "Valid share_will is required" }, { status: 400 });
    }
    if (!nationality || nationality.toString().length === 0) {
      return json({ error: "Valid nationality is required" }, { status: 400 });
    }

    // Check for duplicate fn_id
    const existing = await query<Shareholder>(
      "SELECT * FROM shareholders WHERE fn_id = ?",
      [fn_id]
    );
    if (existing.length > 0) {
      return json({ error: "FN ID already exists" }, { status: 400 });
    }

    await query(
      "INSERT INTO shareholders (fn_id, name_amharic, name_english, city, subcity, wereda, house_number, phone_1) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        fn_id?.toString().trim(),
        name_amharic?.toString().trim(),
        name_english?.toString().trim(),
        city?.toString().trim(),
        subcity?.toString().trim(),
        wereda?.toString().trim(),
        house_number?.toString().trim(),
        phone_1?.toString().trim(),
        phone_2?.toString().trim(),
        email?.toString().trim(),
        share_will?.toString().trim(),
        nationality?.toString().trim()
      ]
    );
  } else if (intent === "update") {
    // Update an existing shareholder
    await query(
      "UPDATE shareholders SET fn_id = ?, name_amharic = ?, name_english = ?, city = ?, subcity = ?, wereda = ?, house_number = ?, phone_1 = ?, phone_2 = ?, email = ?, share_will = ?, nationality = ? WHERE fn_id = ?",
      [
        fn_id as string,
        name_amharic as string,
        name_english as string,
        city as string,
        subcity as string,
        wereda as string,
        house_number as string,
        phone_1 as string,
        phone_2 as string,
        email as string,
        share_will as string,
        nationality as string,
        old_fn_id as string,
      ]
    );
  } else if (intent === "delete") {
    // Delete a shareholder
    // Use original FN ID for deletion
    if (!old_fn_id) {
      return json({ error: "Missing original FN ID" }, { status: 400 });
    }
    await query("DELETE FROM shareholders WHERE fn_id = ?", [old_fn_id as string]);
  }

  // Return a success response
  return json({ success: true });
};

// Main component that renders the page
export default function Index() {
  // Load the shareholders data using the loader
  const shareholders = useLoaderData<typeof loader>();
  // Get action data for error handling
  const actionData = useActionData<typeof action>();
  // Initialize fetcher for form submissions
  const fetcher = useFetcher();
  // Initialize revalidator to refresh data
  const revalidator = useRevalidator();
  // Create ref for the form to reset it
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form after successful submission
  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data &&
      typeof fetcher.data === "object" &&
      !("error" in fetcher.data)
    ) {
      // Reset the form if submission was successful
      formRef.current?.reset();
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Shareholders Manager
          </h1>
          <p className="text-gray-400">Create and manage your shareholders</p>
        </div>

        {/* Create Shareholder Form */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <fetcher.Form
            ref={formRef}
            method="post"
            onSubmit={() => {
              setTimeout(() => {
                revalidator.revalidate();
              }, 500);
            }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                Create New Shareholder
              </h2>
            </div>

            {/* Basic Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-200 mb-4 border-b border-gray-600 pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    FN ID
                  </label>
                  <input
                    name="fn_id"
                    placeholder="6 characters"
                    maxLength={6}
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amharic Name
                  </label>
                  <input
                    name="name_amharic"
                    placeholder="Enter Amharic Name"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    English Name
                  </label>
                  <input
                    name="name_english"
                    placeholder="Enter English Name"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    name="city"
                    placeholder="Enter City"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subcity
                  </label>
                  <input
                    name="subcity"
                    placeholder="Enter Subcity"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Wereda
                  </label>
                  <input
                    name="wereda"
                    placeholder="Enter Wereda"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    House Number
                  </label>
                  <input
                    name="house_number"
                    placeholder="Enter House Number"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone 1
                  </label>
                  <input
                    name="phone_1"
                    placeholder="Enter Phone 1"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone 2
                  </label>
                  <input
                    name="phone_2"
                    placeholder="Enter Phone 2"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    placeholder="Enter Email"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Share Will
                  </label>
                  <input
                    name="share_will"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nationality
                  </label>
                  <input
                    name="nationality"
                    placeholder="Enter Nationality"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {actionData?.error && (
              <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg">
                <div className="flex items-center">
                  <span className="text-red-300 font-medium">
                    {actionData.error}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              name="intent"
              value="create"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Create Shareholder
            </button>
          </fetcher.Form>
        </div>

        {/* Shareholders List */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              Existing Shareholders
            </h2>
          </div>

          {shareholders.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                No shareholders yet
              </h3>
              <p className="text-gray-500">
                Create your first shareholder using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {shareholders.map((shareholder: Shareholder) => (
                <div
                  key={shareholder.id}
                  className="border border-gray-600 rounded-lg p-6 bg-gray-700"
                >
                  <fetcher.Form method="post">
                    {/* Shareholder Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="px-3 py-1 bg-blue-600 rounded text-white font-bold text-sm">
                          {shareholder.fn_id}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {shareholder.name_amharic}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {shareholder.name_english} - {shareholder.city},{" "}
                            {shareholder.subcity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2"></div>
                    </div>

                    {/* Editable Fields Grid */}
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      {/* Basic Info */}
                      <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                        Basic Info
                      </h4>

                      <div className="space-y-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            FN_ID
                          </label>
                          <input
                            name="fn_id"
                            defaultValue={shareholder.fn_id}
                            className="w-full p-2 text-sm bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Amharic Name
                          </label>
                          <input
                            name="name_amharic"
                            defaultValue={shareholder.name_amharic}
                            className="w-full p-2 text-sm bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            English Name
                          </label>
                          <input
                            name="name_english"
                            defaultValue={shareholder.name_english}
                            className="w-full p-2 text-sm bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            City
                          </label>
                          <input
                            name="city"
                            defaultValue={shareholder.city}
                            className="w-full p-2 text-sm bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Subcity
                          </label>
                          <input
                            name="subcity"
                            defaultValue={shareholder.subcity}
                            className="w-full p-2 text-sm bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Wereda
                          </label>
                          <input
                            name="wereda"
                            defaultValue={shareholder.wereda}
                            className="w-full p-2 text-sm bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            House Number
                          </label>
                          <input
                            name="house_number"
                            defaultValue={shareholder.house_number}
                            className="w-full p-2 text-sm bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Phone Number-1
                          </label>
                          <input
                            name="phone_1"
                            defaultValue={shareholder.phone_1}
                            className="w-full p-2 text-sm bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Phone Number-2
                          </label>
                          <input
                            name="phone_2"
                          defaultValue={shareholder.phone_2}
                          className="w-full p-2 text-sm bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Email
                        </label>
                        <input
                          name="email"
                          defaultValue={shareholder.email}
                          className="w-full p-2 text-sm bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Share Will
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          name="share_will"
                          defaultValue={shareholder.share_will}
                          className="w-full p-2 text-sm bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Nationality
                        </label>
                        <input
                          name="nationality"
                          defaultValue={shareholder.nationality}
                          className="w-full p-2 text-sm bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <input
                      type="hidden"
                      name="old_fn_id"
                      value={shareholder.fn_id}
                    />
                    <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                      <div className="flex items-center space-x-3">
                        {fetcher.state === "submitting" && (
                          <div className="flex items-center text-blue-400">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                            <span className="text-sm font-medium">
                              Processing...
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          name="intent"
                          value="update"
                          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                        >
                          Update
                        </button>
                        <button
                          type="submit"
                          name="intent"
                          value="delete"
                          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                          onClick={(e) => {
                            if (
                              !confirm(
                                "Are you sure you want to delete this shareholder?"
                              )
                            ) {
                              e.preventDefault();
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </fetcher.Form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}