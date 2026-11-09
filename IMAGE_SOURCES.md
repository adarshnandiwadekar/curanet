# CuraNet catalogue image sources

The catalogue records remain fictional. These local files are illustrative web reference photographs only; they are not evidence of inventory, ownership, availability, or a CuraNet partnership. They are stored locally so the preview does not depend on hotlinking.

The selected images were sourced through Unsplash public category pages and resized locally for the demo. Before production use, re-check the individual photo license, attribution requirements, and any photographer restrictions.

- Mobility: `client/public/medical/web/web-wheelchair-1.jpg`, `web-wheelchair-2.jpg`, and `web-mobility-aid.jpg` — [Unsplash wheelchair search](https://unsplash.com/s/photos/wheelchairs) and [Unsplash mobility-aid search](https://unsplash.com/s/photos/mobility-aid).
- Patient and home care: `web-hospital-bed.jpg`, `web-hospital-room.jpg`, and `web-care-bed.jpg` — [Unsplash hospital-bed search](https://unsplash.com/s/photos/hospital-bed).
- Rehabilitation: `web-rehab-1.jpg`, `web-rehab-2.jpg`, and `web-rehab-3.jpg` — [Unsplash rehabilitation-center search](https://unsplash.com/s/photos/rehabilitation-center) and [Unsplash physical-therapy search](https://unsplash.com/s/photos/physical-therapy).
- Monitoring: `web-blood-pressure-1.jpg` and `web-blood-pressure-2.jpg` — [Unsplash blood-pressure-monitor search](https://unsplash.com/s/photos/blood-pressure-monitor).

The image assignment is category-based and intentionally reused across fictional records. Product names, quantities, dates, providers, conditions, and availability continue to come from CuraNet's demo dataset and are not claims about the photographs.

## Record-level mapping

Each primary catalogue card image is now unique. The mapping is in `client/src/data/products.ts` under `recordImages`, and the 30 optimized files are in `client/public/medical/web/records/` with the matching record ID in each filename. The imagery is contextual reference material rather than a depiction of the fictional record’s actual condition, quantity, provider, or availability.

Several category-specific candidates came from public image-search results for medical equipment and are retained as demo references. Their commercial source pages and licensing status should be reviewed before any production or public marketing use; CuraNet makes no ownership or endorsement claim about them.
