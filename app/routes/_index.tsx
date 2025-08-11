import {
  json,
  type ActionFunction,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { query } from "services/db.server";

// Meta function to define page metadata (title, description, etc.)
export const meta: MetaFunction = () => {
  return [
    { title: "Remix Fullstack Data Flow" },
    { name: "description", content: "Welcome to Remix Tutorial" },
  ];
};

// Type definition for the Shareholder object
type Shareholder = {
  dp_id: string;
  full_name: string;
  share_amount: number;
};

// Loader function that runs on the server to fetch data
export const loader: LoaderFunction = async () => {
  // Query all users from the database
  const shareholders = await query("SELECT * FROM shareholders", []) as Shareholder[];
  // Return the shareholders as JSON
  return json(shareholders);
};

// Action function to handle form submissions (create, update, delete)
export const action: ActionFunction = async ({ request }) => {
  // Parse the form data from the request
  const formData = await request.formData();
  // Get the intent (action type), id, full_name, and old_id from the form
  const intent = formData.get("intent");
  const id = formData.get("id");
  const name = formData.get("name");
  const old_id = formData.get("old_id");

  // Handle different actions based on the intent
  if (intent === "create") {
    // Create a new shareholder
    await query(
      "INSERT INTO shareholders (dp_id, full_name, share_amount) VALUES (?, ?, ?)",
      [id as string, name as string, 0] // Assuming share_amount is 0 for new entries
    );
  } else if (intent === "update") {
    // Update an existing shareholder
    await query(
      "UPDATE shareholders SET dp_id = ?, full_name = ?,share_amount = ?, WHERE dp_id = ?",
      [id as string, name as string, old_id as string]
    );
  } else if (intent === "delete") {
    // Delete a shareholder
    await query("DELETE FROM shareholders WHERE dp_id = ?", [id as string]);
  }

  // Return a success response
  return json({ ok: true });
};

// Main component that renders the page
export default function Index() {
  // Load the shareholders data using the loader
  const shareholders = useLoaderData<typeof loader>();
  // Initialize fetcher for form submissions
  const fetcher = useFetcher();

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Create User Form */}
      <fetcher.Form method="post" className="mb-8 p-4 border rounded">
        <h2 className="text-lg font-bold mb-2">Create User</h2>
        {/* User ID input */}
        <input
          name="id"
          placeholder="User Id"
          className="w-full p-2 border mb-2"
          required
        />
        {/* Full Name input */}
        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-2 border mb-2"
          required
        />
        {/* Create button */}
        <button
          type="submit"
          name="intent"
          value="create"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Create
        </button>
      </fetcher.Form>

      {/* Users List */}
      <div className="space-y-4">
        {/* Map through each user and render their details */}
        {users.map((user: User) => (
          <div key={user.user_id} className="p-4 border rounded ">
            <fetcher.Form method="post" className="flex gap-2">
              {/* Editable User ID field */}
              <input
                name="id"
                defaultValue={user.user_id}
                className="w-16 p-2 border mb-2"
                required
              />
              {/* Editable Full Name field */}
              <input
                name="name"
                defaultValue={user.user_full_name}
                className="w-32 p-2 border mb-2"
                required
              />

              {/* Hidden field to store the original ID for updates */}
              <input type="hidden" name="old_id" value={user.user_id} />
              <div className="flex gap-2">
                {/* Update button */}
                <button
                  type="submit"
                  name="intent"
                  value="update"
                  className="bg-green-500 text-white p-2 rounded flex-1"
                >
                  Update
                </button>
                {/* Delete button */}
                <button
                  type="submit"
                  name="intent"
                  value="delete"
                  className="bg-red-500 text-white p-2 rounded flex-1"
                >
                  Delete
                </button>
              </div>
            </fetcher.Form>
          </div>
        ))}
      </div>
    </div>
  );
}
