import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function TestPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const testAll = useAction(api.test.testAll);

  const runTests = async () => {
    setLoading(true);
    try {
      const testResults = await testAll();
      setResults(testResults);
    } catch (error) {
      console.error("Test failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h1 className="text-2xl font-semibold mb-6">Test du Backend</h1>
        
        <button
          onClick={runTests}
          disabled={loading}
          className="px-4 py-2.5 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/30 transition-colors disabled:opacity-50"
        >
          {loading ? "Test en cours..." : "Lancer les tests"}
        </button>

        {results && (
          <div className="mt-6 space-y-4">
            {Object.entries(results).map(([module, data]: [string, any]) => (
              <div key={module} className="p-4 bg-white/5 rounded-lg">
                <h2 className="text-lg font-medium mb-2 capitalize">{module}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>{data.success} tests réussis</span>
                  </div>
                  {data.failed > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-red-400">✗</span>
                      <span>{data.failed} tests échoués</span>
                    </div>
                  )}
                </div>
                {data.errors.length > 0 && (
                  <div className="mt-2 text-red-400 text-sm">
                    {data.errors.map((error: string, i: number) => (
                      <div key={i}>{error}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
