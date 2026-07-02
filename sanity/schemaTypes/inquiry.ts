import { defineField, defineType } from "sanity";

/**
 * A single document type shared by every form on the site
 * (ContactSection, TripPlannerForm, CTABooking, PlanSafari).
 * `type` tells you which form it came from; `status` is for your
 * own CRM-style follow-up workflow inside Sanity Studio.
 */
export const inquiry = defineType({
  name: "inquiry",
  title: "Inquiry",
  type: "document",
  fields: [
    defineField({
      name: "type",
      title: "Source Form",
      type: "string",
      options: {
        list: [
          { title: "Contact Form", value: "contact" },
          { title: "Trip Planner", value: "tripPlanner" },
          { title: "Booking Request (CTA)", value: "booking" },
          { title: "Plan Safari", value: "planSafari" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Booked", value: "booked" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),

    defineField({ name: "name", title: "Full Name", type: "string" }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "message", title: "Message / Notes", type: "text" }),

    // ContactSection: pre-filled when arriving from a package or lodge page
    defineField({
      name: "reference",
      title: "Reference",
      type: "object",
      fields: [
        { name: "refType", title: "Type", type: "string" }, // "Package" | "Property"
        { name: "label", title: "Label", type: "string" },
        { name: "slug", title: "Slug", type: "string" },
      ],
    }),

    // TripPlannerForm
    defineField({
      name: "destinations",
      title: "Destinations (multi-select)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "tier", title: "Comfort Tier", type: "string" }),

    // Shared across TripPlannerForm / CTABooking / PlanSafari
    defineField({ name: "dateStart", title: "Earliest Travel Date", type: "date" }),
    defineField({ name: "dateEnd", title: "Latest Travel Date", type: "date" }),
    defineField({ name: "adults", title: "Adults", type: "number" }),
    defineField({ name: "children", title: "Children", type: "number" }),

    // CTABooking / PlanSafari
    defineField({ name: "destination", title: "Destination (single)", type: "string" }),
    defineField({ name: "packageChoice", title: "Package Type", type: "string" }),

    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { name: "name", email: "email", type: "type" },
    prepare({ name, email, type }) {
      return {
        title: name || email || "Untitled inquiry",
        subtitle: type,
      };
    },
  },
});
