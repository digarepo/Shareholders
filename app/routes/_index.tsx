import {
  json,
  redirect,
  // TypeScript server restart trigger
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
import { query, type Shareholder } from "services/db.server";

// Meta function to define page metadata (title, description, etc.)
export const meta: MetaFunction = () => {
  return [
    { title: "Remix Fullstack Data Flow" },
    { name: "description", content: "Welcome to Remix Tutorial" },
  ];
};

// Using the Statement type from db.server for consistency

// Loader function that runs on the server to fetch data
export const loader: LoaderFunction = async () => {
  try {
    // Query all shareholders from the database
    const shareholders = await query<Shareholder>("SELECT * FROM shareholders ORDER BY full_name");
    return json(shareholders);
  } catch (error) {
    console.error("Loader error:", error);
    return json([], { status: 500 });
  }
};

// Action function to handle form submissions (create, update, delete)
export const action: ActionFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const fn_id = formData.get("fn_id") as string;
  const name_amharic = formData.get("name_amharic") as string;
  const name_english = formData.get("name_english") as string;
  const city = formData.get("city") as string;
  const subcity = formData.get("subcity") as string;
  const wereda = formData.get("wereda") as string;
  const house_number = formData.get("house_number") as string;
  const phone_1 = formData.get("phone_1") as string;
  const phone_2 = formData.get("phone_2") as string;
  const email = formData.get("email") as string;
  const share_will = formData.get("share_will") as string;
  const nationality = formData.get("nationality") as string;
  const receipt_number = formData.get("receipt_number") as string;
  const attendance_2023_dec_24 = formData.get("attendance_2023_dec_24") as string;
  const certificate_number = formData.get("certificate_number") as string;
  const taken_certificate = formData.get("taken_certificate") as string;
  const share_price = formData.get("share_price") as string;
  const error_share = formData.get("error_share") as string;
  const error_form = formData.get("error_form") as string;
  const error_bank_slip = formData.get("error_bank_slip") as string;
  const comment_medina = formData.get("comment_medina") as string;
  const general_comment = formData.get("general_comment") as string;
  const version = formData.get("version") as string;

  if (intent === "create" || intent === "update") {
    // Validate input
    if (!fn_id || fn_id.trim().length !== 6) {
      return json({ error: "FN ID must be exactly 6 characters" }, { status: 400 });
    }
    if (!name_amharic || name_amharic.trim().length === 0) {
      return json({ error: "Name in Amharic is required" }, { status: 400 });
    }
    if (!name_english || name_english.trim().length === 0) {
      return json({ error: "Name in English is required" }, { status: 400 });
    }
    if (!city || city.trim().length === 0) {
      return json({ error: "City is required" }, { status: 400 });
    }
    if (!subcity || subcity.trim().length === 0) {
      return json({ error: "Subcity is required" }, { status: 400 });
    }
    if (!wereda || wereda.trim().length === 0) {
      return json({ error: "Wereda is required" }, { status: 400 });
    }
    if (!house_number || house_number.trim().length === 0) {
      return json({ error: "House number is required" }, { status: 400 });
    }
    if (!phone_1 || phone_1.trim().length === 0) {
      return json({ error: "Phone 1 is required" }, { status: 400 });
    }
    if (!email || email.trim().length === 0) {
      return json({ error: "Email is required" }, { status: 400 });
    }
    if (!share_will || isNaN(share_will)) {
      return json({ error: "Valid share will is required" }, { status: 400 });
    }
    if (!nationality || nationality.trim().length === 0) {
      return json({ error: "Nationality is required" }, { status: 400 });
    }
    if (!receipt_number || receipt_number.trim().length === 0) {
      return json({ error: "Receipt number is required" }, { status: 400 });
    }
    if (!attendance_2023_dec_24 || isNaN(attendance_2023_dec_24)) {
      return json({ error: "Valid attendance is required" }, { status: 400 });
    }
    if (!certificate_number || certificate_number.trim().length === 0) {
      return json({ error: "Certificate number is required" }, { status: 400 });
    }
    if (!share_price || isNaN(share_price)) {
      return json({ error: "Valid share price is required" }, { status: 400 });
    }
    if (!version || isNaN(version)) {
      return json({ error: "Valid version is required" }, { status: 400 });
    }

    if (intent === "create") {
      // Check if shareholder already exists
      const existing = await query("SELECT fn_id FROM shareholders WHERE fn_id = ?", [fn_id]);
      if (existing.length > 0) {
        return json({ error: "Shareholder with this FN ID already exists" }, { status: 400 });
      }
      
      
      await query(
        "INSERT INTO shareholders (fn_id, name_amharic, name_english, city, subcity, wereda, house_number, phone_1, phone_2, email, share_will, nationality, receipt_number, attendance_2023_dec_24, certificate_number, taken_certificate, share_price, error_share, error_form, error_bank_slip, comment_medina, general_comment, version) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [fn_id, name_amharic.trim(), name_english.trim(), city.trim(), subcity.trim(), wereda.trim(), house_number.trim(), phone_1.trim(), phone_2.trim(), email.trim(), share_will, nationality.trim(), receipt_number.trim(), attendance_2023_dec_24, certificate_number.trim(), taken_certificate, share_price, error_share.trim(), error_form.trim(), error_bank_slip.trim(), comment_medina.trim(), general_comment.trim(), version]
      );
    } else {
      // Update existing shareholder
      await query(
        "UPDATE shareholders SET name_amharic = ?, name_english = ?, city = ?, subcity = ?, wereda = ?, house_number = ?, phone_1 = ?, phone_2 = ?, email = ?, share_will = ?, nationality = ?, receipt_number = ?, attendance_2023_dec_24 = ?, certificate_number = ?, taken_certificate = ?, share_price = ?, error_share = ?, error_form = ?, error_bank_slip = ?, comment_medina = ?, general_comment = ?, version = ? WHERE fn_id = ?",
        [name_amharic.trim(), name_english.trim(), city.trim(), subcity.trim(), wereda.trim(), house_number.trim(), phone_1.trim(), phone_2.trim(), email.trim(), share_will, nationality.trim(), receipt_number.trim(), attendance_2023_dec_24, certificate_number.trim(), taken_certificate, share_price, error_share.trim(), error_form.trim(), error_bank_slip.trim(), comment_medina.trim(), general_comment.trim(), version, fn_id]
      );
    }
  } else if (intent === "delete") {
    if (!fn_id) {
      return json({ error: "FN ID is required" }, { status: 400 });
    }
    await query("DELETE FROM shareholders WHERE fn_id = ?", [fn_id]);
  }

  // Return a success response
  return json({ success: true });
};

// Main component that renders the page
export default function Index() {
  // Load the shareholders data using the loader
  const shareholders = useLoaderData<Shareholder[]>();
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
          <h1 className="text-3xl font-bold text-white mb-2">Statements Manager</h1>
          <p className="text-gray-400">Create and manage your financial statements</p>
        </div>

        {/* Create Statement Form */}
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
              <h2 className="text-2xl font-bold text-white">Create New Shareholder</h2>
            </div>

            {/* Basic Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Shareholder Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">DP ID</label>
                  <input
                    name="dp_id"
                    placeholder="6 characters"
                    maxLength={6}
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    name="full_name"
                    placeholder="Shareholder's full name"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Share Amount</label>
                  <input
                    name="share_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
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
                  <span className="text-red-300 font-medium">{actionData.error}</span>
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
              Add Shareholder
            </button>
          </fetcher.Form>
        </div>

          {/* Shareholders List */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Shareholders</h2>
            <p className="text-gray-400">Total shareholders: {shareholders.length}</p>
          </div>

          {shareholders.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-300 mb-2">No shareholders yet</h3>
              <p className="text-gray-500">Add your first shareholder using the form above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {shareholders.map((shareholder) => (
                <div
                  key={shareholder.dp_id}
                  className="border border-gray-600 rounded-lg p-6 bg-gray-700"
                >
                  <fetcher.Form method="post" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">DP ID</label>
                        <input
                          name="dp_id"
                          defaultValue={shareholder.dp_id}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input
                          name="full_name"
                          defaultValue={shareholder.full_name}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Share Amount</label>
                        <div className="flex">
                          <input
                            name="share_amount"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={shareholder.share_amount}
                            className="flex-1 p-2 bg-gray-600 border border-gray-500 text-white rounded-l-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600">
                      <div className="flex items-center space-x-3">
                        {fetcher.state === "submitting" && (
                          <div className="flex items-center text-blue-400">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                            <span className="text-sm font-medium">Saving...</span>
                          </div>
                        )}
                      </div>
                      <button
                        type="submit"
                        name="intent"
                        value="update"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        Update
                      </button>
                      <button
                        type="submit"
                        name="intent"
                        value="delete"
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                        onClick={(e) => {
                          if (!confirm('Are you sure you want to delete this shareholder?')) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Delete
                      </button>
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
