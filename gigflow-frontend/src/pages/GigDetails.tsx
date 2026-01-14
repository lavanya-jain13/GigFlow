import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import api from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type Gig = {
  _id: string;
  title: string;
  description: string;
  budget: number;
  ownerId: string;
  status: "open" | "assigned";
};

type Bid = {
  _id: string;
  freelancerId: {
    _id: string;
    name: string;
    email: string;
  };
  message: string;
  price: number;
  status: "pending" | "hired" | "rejected";
};


export default function GigDetails() {
  const [match, params] = useRoute("/gigs/:id");

const gigId =
  match && params?.id && params.id !== "undefined"
    ? params.id
    : null;


  const { user } = useAuth();

  const [gig, setGig] = useState<Gig | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");

  const isOwner = user?.id === gig?.ownerId;
  const hasBid = bids.some(b => b.freelancerId._id === user?.id);

  // Fetch gig
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await api.get("/gigs");
        const found = res.data.find((g: Gig) => g._id === gigId);
        setGig(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [gigId]);

  // Fetch bids (OWNER ONLY)
  useEffect(() => {
  if (!match || !isOwner || !gigId) return;

  api.get(`/bids/${gigId}`).then(res => setBids(res.data));
}, [match, isOwner, gigId]);

  const submitBid = async () => {
  try {
    if (!gigId) throw new Error("Invalid gig");
    if (!message.trim()) throw new Error("Message required");

    const bidPrice = Number(price);
    if (!bidPrice || bidPrice <= 0) {
      throw new Error("Invalid price");
    }

    await api.post("/bids", {
      gigId,
      message: message.trim(),
      price: bidPrice
    });

    alert("Bid submitted");
    setMessage("");
    setPrice("");
  } catch (err: any) {
    console.error("BID ERROR:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Bid failed");
  }
};


  const hireBid = async (bidId: string) => {
  if (!bidId) return alert("Invalid bid ID");
  await api.patch(`/bids/${bidId}/hire`);


    // Refresh bids & gig state
    const updatedBids = await api.get(`/bids/${gigId}`);
    setBids(updatedBids.data);
    setGig(prev => prev ? { ...prev, status: "assigned" } : prev);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">Loading...</div>
      </>
    );
  }

  if (!gig) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">Gig not found</div>
      </>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Gig Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{gig.title}</CardTitle>
            <Badge>{gig.status}</Badge>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{gig.description}</p>
            <p className="font-bold">Budget: ₹{gig.budget}</p>
          </CardContent>
        </Card>

        {/* OWNER VIEW */}
        {isOwner && (
          <Card>
            <CardHeader>
              <CardTitle>Received Bids</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bids.length === 0 && <p>No bids yet.</p>}

              {bids.map(bid => (
                <div key={bid._id} className="border p-4 rounded">
                  <p><strong>{bid.freelancerId.name}</strong></p>
                  <p>₹{bid.price}</p>

                  <p className="mb-2">{bid.message}</p>

                  {bid.status === "pending" && gig.status === "open" && (
                    <Button onClick={() => hireBid(bid._id)}>
                      Hire
                    </Button>
                  )}

                  {bid.status === "hired" && (
                    <Badge className="bg-green-600">Hired</Badge>
                  )}

                  {bid.status === "rejected" && (
                    <Badge variant="secondary">Rejected</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* FREELANCER VIEW */}
        {!isOwner && gig.status === "open" && !hasBid && user && (
          <Card>
            <CardHeader>
              <CardTitle>Place a Bid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Your price"
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
              <Textarea
                placeholder="Why should we hire you?"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <Button onClick={submitBid}>Submit Bid</Button>
            </CardContent>
          </Card>
        )}

        {!isOwner && hasBid && (
          <Badge>You already placed a bid</Badge>
        )}

        {gig.status === "assigned" && (
          <Badge variant="secondary">This gig is closed</Badge>
        )}
      </div>
    </div>
  );
}
