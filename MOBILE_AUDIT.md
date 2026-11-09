
## Wheelchair alignment correction

The wheelchair record was re-composed at the asset level because CSS object positioning cannot remove empty source whitespace. A pixel-bound measurement of the dark subject bounds now places the subject center at **x=461** against a **460px canvas midpoint**. The rendered 391px detail screenshot confirms the chair is centered inside the gallery rather than merely centered as an image box.

The corrected final build remains approximately 4.6 MB including local images. The 30 record-specific images total approximately 2.1 MB; the main JavaScript and CSS bundles remain 494.5 KB and 110.5 KB raw respectively. The project checker, typecheck, tests, production build, route checks, and corrected wheelchair asset check all pass again.
