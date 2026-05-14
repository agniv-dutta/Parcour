export const QUERY_COLORS = {
  pre_sales_availability: { bg: '#1A3A5C', text: '#5BA3D9', label: 'Availability' },
  pre_sales_pricing:      { bg: '#2D1F4E', text: '#9B7FD4', label: 'Pricing' },
  post_sales_checkin:     { bg: '#1A3D2E', text: '#4CAF82', label: 'Check-in' },
  special_request:        { bg: '#3D2E1A', text: '#E8A838', label: 'Special Req' },
  complaint:              { bg: '#3D1A1A', text: '#E05555', label: 'Complaint' },
  general_enquiry:        { bg: '#2A2A2A', text: '#8B96A5', label: 'General' },
};

export const MOCK_MESSAGES = [
  {
    id: "msg-001",
    source: "whatsapp",
    guest_name: "Rahul Sharma",
    message_text: "Is the villa available from April 20 to 24? What is the rate for 2 adults?",
    query_type: "pre_sales_availability",
    confidence_score: 0.91,
    action: "auto_send",
    drafted_reply: "Hi Rahul! Great news — Villa B1 in Assagao is available from April 20–24. For 2 adults, the rate is INR 18,000 per night, totalling INR 72,000 for 4 nights. The villa features 3 bedrooms, a private pool, and stunning Goa views. Shall I hold these dates for you?",
    booking_ref: "NIS-2024-0891",
    property_id: "Villa B1, Assagao",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    processing_time_ms: 243
  },
  {
    id: "msg-002",
    source: "airbnb",
    guest_name: "Priya Mehta",
    message_text: "The AC in the master bedroom stopped working. It's very hot and we're uncomfortable. This is unacceptable for a property at this price.",
    query_type: "complaint",
    confidence_score: 0.52,
    action: "escalate",
    drafted_reply: "Dear Priya, I sincerely apologise for the discomfort. This is absolutely not the experience we want for you. I'm alerting our caretaker immediately and will ensure this is resolved within the hour. As a gesture of goodwill, I'd like to discuss a partial refund for tonight.",
    booking_ref: "NIS-2024-0904",
    property_id: "Villa C2, Anjuna",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    processing_time_ms: 381
  },
  {
    id: "msg-003",
    source: "booking_com",
    guest_name: "Arjun Nair",
    message_text: "What time can we check in? Also what is the WiFi password? We land at 1pm.",
    query_type: "post_sales_checkin",
    confidence_score: 0.78,
    action: "agent_review",
    drafted_reply: "Hi Arjun! Welcome to Nistula. Check-in is from 2pm. Since you land at 1pm, you should arrive perfectly on time. The WiFi network is 'Nistula_Villa' and the password is Nistula@2024. Our caretaker will be there to welcome you. Safe travels!",
    booking_ref: "NIS-2024-0917",
    property_id: "Suite D4, Vagator",
    timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
    processing_time_ms: 198
  },
  {
    id: "msg-004",
    source: "instagram",
    guest_name: "Kavya Reddy",
    message_text: "Do you allow pets? We have a small golden retriever. Also is there parking available?",
    query_type: "general_enquiry",
    confidence_score: 0.82,
    action: "agent_review",
    drafted_reply: "Hi Kavya! Lovely to hear from you. Regarding pets, our team will confirm this shortly as it varies by property. Villa B1 does have secure private parking for 2 cars. I'll get back to you on the pet policy within a few hours!",
    booking_ref: "NIS-2024-0923",
    property_id: "Villa B1, Assagao",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    processing_time_ms: 167
  }
];
