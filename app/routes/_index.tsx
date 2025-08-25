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
    // Query all shareholders from the database,
    const shareholders = await query<Shareholder>("SELECT * FROM shareholders");
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
 
  const formData = await request.formData();
  // const intent = formData.get("intent");
  const intent = formData.get("intent");
  // const fn_id = formData.get("fn_id") as string;
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

  //handle different actions
  if (intent === "create" ) {
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
    } else if (intent === "update") {
      // Update existing shareholder
      await query(
        "UPDATE shareholders SET name_amharic = ?, name_english = ?, city = ?, subcity = ?, wereda = ?, house_number = ?, phone_1 = ?, phone_2 = ?, email = ?, share_will = ?, nationality = ?, receipt_number = ?, attendance_2023_dec_24 = ?, certificate_number = ?, taken_certificate = ?, share_price = ?, error_share = ?, error_form = ?, error_bank_slip = ?, comment_medina = ?, general_comment = ?, version = ? WHERE fn_id = ?",
        [name_amharic.trim(), name_english.trim(), city.trim(), subcity.trim(), wereda.trim(), house_number.trim(), phone_1.trim(), phone_2.trim(), email.trim(), share_will, nationality.trim(), receipt_number.trim(), attendance_2023_dec_24, certificate_number.trim(), taken_certificate, share_price, error_share.trim(), error_form.trim(), error_bank_slip.trim(), comment_medina.trim(), general_comment.trim(), version, fn_id]
      );
    }
  } else if (intent === "delete") {
    // delete a shareholder
    // use original fn_id
    if (!fn_id) {
      return json({ error: "FN ID is required" }, { status: 400 });
    }
    await query("DELETE FROM shareholders WHERE fn_id = ?", [fn_id]);
  }

    // Return a success response
    console.log('Action completed successfully');
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
          <h1 className="text-3xl font-bold text-white mb-2">Statements Manager</h1>
          <p className="text-gray-400">Create and manage your financial statements</p>
        </div>

        {/* Create Statement Form */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 mb-8">
          <fetcher.Form
            ref={formRef}
            method="post"
            action="?index"
            onSubmit={(e) => {
              console.log('Form submitted');
              // This will be handled by the fetcher
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">FN ID (6 chars)</label>
                  <input
                    name="fn_id"
                    placeholder="6 characters"
                    maxLength={6}
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name (Amharic)</label>
                  <input
                    name="name_amharic"
                    placeholder="Name in Amharic"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name (English)</label>
                  <input
                    name="name_english"
                    placeholder="Name in English"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    name="city"
                    placeholder="City"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subcity</label>
                  <input
                    name="subcity"
                    placeholder="Subcity"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Wereda</label>
                  <input
                    name="wereda"
                    placeholder="Wereda"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">House Number</label>
                  <input
                    name="house_number"
                    placeholder="House Number"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primary Phone</label>
                  <input
                    name="phone_1"
                    type="tel"
                    placeholder="+251911223344"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Phone</label>
                  <input
                    name="phone_2"
                    type="tel"
                    placeholder="+251911223345 (Optional)"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="shareholder@example.com"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Share Will</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nationality</label>
                  <input
                    name="nationality"
                    placeholder="Ethiopian"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Receipt Number</label>
                  <input
                    name="receipt_number"
                    placeholder="RCPT-001"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="attendance_2023_dec_24"
                    id="attendance"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                  />
                  <label htmlFor="attendance" className="ml-2 block text-sm text-gray-300">
                    Attended Dec 24, 2023
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Certificate Number</label>
                  <input
                    name="certificate_number"
                    placeholder="CERT-001"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="taken_certificate"
                    id="taken_certificate"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                  />
                  <label htmlFor="taken_certificate" className="ml-2 block text-sm text-gray-300">
                    Certificate Taken
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Share Price</label>
                  <input
                    name="share_price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Share Error</label>
                    <input
                      name="error_share"
                      placeholder="Share error details"
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Form Error</label>
                    <input
                      name="error_form"
                      placeholder="Form error details"
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bank Slip Error</label>
                    <input
                      name="error_bank_slip"
                      placeholder="Bank slip error details"
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Medina Comment</label>
                  <textarea
                    name="comment_medina"
                    rows={2}
                    placeholder="Comments from Medina"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">General Comment</label>
                  <textarea
                    name="general_comment"
                    rows={2}
                    placeholder="Additional notes"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Version</label>
                  <input
                    name="version"
                    type="number"
                    min="1"
                    defaultValue="1"
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
            <div className="mt-6">
              <button
                type="submit"
                name="intent"
                value="create"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                disabled={fetcher.state !== "idle"}
              >
                {fetcher.state === "submitting" ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  'Add Shareholder'
                )}
              </button>
              {actionData?.error && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-800 text-red-200 rounded-lg">
                  <h3 className="font-bold">Error: {actionData.error}</h3>
                  {actionData.details && (
                    <div className="mt-2 text-sm opacity-75">
                      <p>Details: {actionData.details}</p>
                    </div>
                  )}
                  <p className="mt-2 text-sm">Please check the console for more details and try again.</p>
                </div>
              )}
            </div>
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
                        <label className="block text-sm font-medium text-gray-300 mb-1">FN ID</label>
                        <input
                          name="fn_id"
                          defaultValue={shareholder.fn_id}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Name (Amharic)</label>
                        <input
                          name="name_amharic"
                          defaultValue={shareholder.name_amharic}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Name (English)</label>
                        <input
                          name="name_english"
                          defaultValue={shareholder.name_english}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                        <input
                          name="city"
                          defaultValue={shareholder.city}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Subcity</label>
                        <input
                          name="subcity"
                          defaultValue={shareholder.subcity}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Wereda</label>
                        <input
                          name="wereda"
                          defaultValue={shareholder.wereda}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                     

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">House Number</label>
                        <input
                          name="house_number"
                          defaultValue={shareholder.house_number}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Primary Phone</label>
                        <input
                          name="phone_1"
                          defaultValue={shareholder.phone_1}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Secondary Phone</label>
                        <input
                          name="phone_2"
                          defaultValue={shareholder.phone_2}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                          name="email"
                          type="email"
                          defaultValue={shareholder.email}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Share Will</label>
                        <input
                          name="share_will"
                          type="number"
                          step="0.01"
                          min="0"
                          defaultValue={shareholder.share_will}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Nationality</label>
                        <input
                          name="nationality"
                          defaultValue={shareholder.nationality}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Receipt Number</label>
                        <input
                          name="receipt_number"
                          defaultValue={shareholder.receipt_number}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="attendance_2023_dec_24"
                          defaultChecked={Boolean(shareholder.attendance_2023_dec_24)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-300">Attended Dec 24, 2023</label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Certificate Number</label>
                        <input
                          name="certificate_number"
                          defaultValue={shareholder.certificate_number}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="taken_certificate"
                          defaultChecked={Boolean(shareholder.taken_certificate)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-300">Certificate Taken</label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Share Price</label>
                        <input
                          name="share_price"
                          type="number"
                          step="0.01"
                          min="0"
                          defaultValue={shareholder.share_price}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Share Error</label>
                        <input
                          name="error_share"
                          defaultValue={shareholder.error_share}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Form Error</label>
                        <input
                          name="error_form"
                          defaultValue={shareholder.error_form}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                      </div>
                      

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Bank Slip Error</label>
                        <input
                          name="error_bank_slip"
                          defaultValue={shareholder.error_bank_slip}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                      </div>


                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Medina Comment</label>
                        <textarea
                          name="comment_medina"
                          defaultValue={shareholder.comment_medina}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                      </div>
                      

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Medina Comment</label>
                        <textarea
                          name="comment_medina"
                          defaultValue={shareholder.comment_medina}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                      </div>

                      {/* version */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Version</label>
                        <input
                          name="version"
                          defaultValue={shareholder.version}
                          className="w-full p-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
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
