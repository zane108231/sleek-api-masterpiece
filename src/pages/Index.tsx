import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactJson from "react-json-view";

interface Endpoint {
  name: string;
  description: string;
  method: string;
  category: string;
  path: string;
  version: string;
  author: string;
}

const Index = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/endpoints")
      .then((res) => res.json())
      .then((data) => {
        setEndpoints(data);
        const uniqueCategories = [...new Set(data.map((ep: Endpoint) => ep.category))];
        setCategories(uniqueCategories);
      });
  }, []);

  const handleEndpointClick = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
    setResponse(null);
    setInputValue("");
  };

  const handleTryEndpoint = async () => {
    if (!selectedEndpoint) return;

    const url = `http://localhost:3000${selectedEndpoint.path}${inputValue}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: "Failed to fetch response" });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={categories[0]}>
                <TabsList className="w-full">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="capitalize">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {categories.map((category) => (
                  <TabsContent key={category} value={category}>
                    <div className="space-y-2">
                      {endpoints
                        .filter((ep) => ep.category === category)
                        .map((endpoint) => (
                          <div
                            key={endpoint.path}
                            onClick={() => handleEndpointClick(endpoint)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedEndpoint?.path === endpoint.path
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="uppercase text-xs font-bold px-2 py-1 rounded bg-secondary">
                                {endpoint.method}
                              </span>
                              <span className="font-medium">{endpoint.name}</span>
                            </div>
                            <p className="text-sm mt-1 opacity-80">{endpoint.description}</p>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          {selectedEndpoint ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="uppercase text-xs font-bold px-2 py-1 rounded bg-secondary">
                    {selectedEndpoint.method}
                  </span>
                  {selectedEndpoint.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{selectedEndpoint.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter query parameters..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Button onClick={handleTryEndpoint}>Try it</Button>
                  </div>
                  {response && (
                    <Card>
                      <CardContent className="p-4">
                        <ReactJson
                          src={response}
                          theme="tomorrow"
                          displayDataTypes={false}
                          enableClipboard={false}
                          style={{ backgroundColor: "transparent" }}
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select an endpoint to test</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;