
import React from "react";
import ReactMarkdown from "react-markdown";
import { GetServerSideProps } from "next";

type Suggestion = {
  generated_text: string;
  prompt: string;
  invoice_month: string;
  billing_account_id: string;
  project_id: string;
  project_number: string;
  project_name: string;
  service_overview: string;
};

type Props = {
  suggestions: Suggestion[];
};

const PersonalhubGeminiSuggestions: React.FC<Props> = ({ suggestions }) => {
  return (
    <div className="container mx-auto px-4 py-10 relative">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            💡 GenAI Cloud Optimization Suggestions
          </h1>

          {suggestions.length === 0 && (
            <p className="text-gray-500">No suggestions available at the moment.</p>
          )}

          {suggestions.map((item, i) => (
            <div key={i} className="mb-10 border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-1">
                🔧 Project: <span className="text-blue-600">{item.project_name}</span>
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Billing Month: {item.invoice_month}
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 font-medium mb-1">Prompt</p>
                <p className="text-gray-800 whitespace-pre-wrap">{item.prompt}</p>
              </div>

              <div className="prose prose-blue max-w-none mb-4">
                <p className="text-sm text-gray-600 font-medium mb-1">Generated Suggestions</p>
                <ReactMarkdown>{item.generated_text}</ReactMarkdown>
              </div>

              <div className="text-sm text-gray-700">
                <span className="font-medium">🛠 Services Used:</span> {item.service_overview}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

  try {
    // Fetch Identity Token from metadata server
    /////////// have API address in a ENV variable/secret to improve security
    const metadataServerUrl =
      "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=https://fastapi-run-415088972722.us-central1.run.app";
    const tokenResponse = await fetch(metadataServerUrl, {
      headers: {
        "Metadata-Flavor": "Google",
      },
      signal: controller.signal,
    });

    if (!tokenResponse.ok) {
      console.error("Failed to fetch Identity Token:", tokenResponse.status);
      clearTimeout(timeoutId);
      return { props: { suggestions: [] } };
    }

    const token = await tokenResponse.text();

    // Fetch data from FastAPI endpoint
    const apiUrl =
      "https://fastapi-run-415088972722.us-central1.run.app/fetch/billing_prod/genai_service_billing_standard?limit=1";
    const apiResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!apiResponse.ok) {
      console.error("API responded with status:", apiResponse.status);
      return { props: { suggestions: [] } };
    }

    const json = await apiResponse.json();
    console.log("API response JSON:", json);
    type APIResponse = { results: Suggestion[] };
    const data = json as APIResponse;
    const suggestions = Array.isArray(data.results) ? data.results : [];

    return { props: { suggestions } };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Fetch aborted due to timeout");
    } else {
      console.error("Failed to fetch suggestions:", error);
    }
    return { props: { suggestions: [] } };
  }
};

export default PersonalhubGeminiSuggestions;
