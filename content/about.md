---
title: About
layout: page
order: 20030
outputs:
  - html
classes:
  - scores-copyright-page
---

{{ publication.description.full }}

{% backmatter %}

<div class="citation-info">

## Citation Information

### Chicago

{% citation context='publication', type='chicago' %}

### MLA

{% citation context='publication', type='mla' %}

### Permanent URL

{{ publication.url }}

</div>
<div class="revision-history">

## Revision History

{{ publication.revision_statement | markdownify }}

{% for revision in publication.revision_history %}

### {{ revision.date }}

{% for item in revision.summary %}
- {{ item | markdownify }}
{% endfor %}

{% endfor %}

</div>
<div class="other-formats">

## Other Formats

{% for link in publication.resource_link %}
{% if link.type == "other-format" %}
- [{{ link.name }}]({{ link.url }})
{% endif %}
{% endfor %}

</div>
<div class="copyright">

## Copyright

{{ config.quire_credit_line | markdownify }}

{% copyright %}

</div>
<div class="publisher">

{% for press in publication.publisher %}
{{ press.address | markdownify }}
{% endfor %}

</div>
<div class="project-team">

{% for person in publication.project_team %}
- {{ person | markdownify }}
{% endfor %}

</div>
<div class="colophon">

Type composed in U001

</div>
<div class="cip-data">

{{ publication.library_of_congress_cip | markdownify }}

</div>
<div class="pub-info">

Every effort has been made to contact the owners and photographers of illustrations reproduced here whose names do not appear in the captions or in the illustration credits at the back of this book. Anyone having further information concerning copyright holders is asked to contact Getty Publications so this information can be included in future printings. 

This publication was peer reviewed through a single-masked process in which the reviewers remained anonymous.

{% accordion '## Splash Page Image Captions' %}

Benjamin Patterson (American, 1934–2016). [*Duo for Voice and a String Instrument*](/object-index/215/#fig-215-d), 1961. Getty Research Institute, Jean Brown Papers, 890164, box 39, folder 32. © The Estate of Benjamin Patterson.

Benjamin Patterson (American, 1934–2016). [Handwritten score of *Paper Piece* in English on paper](/object-index/201/), 1960. Getty Research Institute, Jean Brown Papers, 890164, box 39, folder 33. © The Estate of Benjamin Patterson. 

Benjamin Patterson (American, 1934–2016). [*“Situations” for 3 Pianos*](/object-index/212/#fig-212-a), 1960. Getty Research Institute, Jean Brown Papers, 890164, box 39, folder 32. © The Estate of Benjamin Patterson.

Yvonne Rainer (American, b. 1934). [Graphic scores related to *Trio B*, from *The Mind Is a Muscle*](/object-index/454/#fig-454-a), ca. 1966–68. Getty Research Institute, Yvonne Rainer Papers, 2006.M.24, box 22, folder 3. Used with Permission. © Yvonne Rainer.

Yvonne Rainer (American, b. 1934). [Notebook sketches related to *We Shall Run*](/object-index/436/#fig-436-b), ca. 1963. Getty Research Institute, Yvonne Rainer Papers, 2006.M.24, box 1, folder 5. Used with Permission. © Yvonne Rainer.

Yvonne Rainer (American, b. 1934). [Notebook page related to *Watering Place*](/object-index/448/), ca. 1960. Getty Research Institute, Yvonne Rainer Papers, 2006.M.24, box 1, folder 2. Used with Permission. © Yvonne Rainer.

Yvonne Rainer (American, b. 1934). [Notes related to *Three Satie Spoons*, *The Bells*, and *Ordinary Dance*](/object-index/467/#fig-467-a ), 1961–62. Getty Research Institute, Yvonne Rainer Papers, 2006.M.24, box 30, folder 1. Used with Permission. © Yvonne Rainer.

Allan Kaprow (American, 1927–2006). [Drawing on the handwritten draft of the program for *Routine*](/object-index/564/), 1973. Getty Research Institute, Allan Kaprow Papers, 980063, box 24, folder 9. 

Allan Kaprow (American, 1927–2006). [*Throat and Cough Piece*](/object-index/580/), 1957–58. Getty Research Institute, Allan Kaprow Papers, 980063, box 4, folder 13. 

Allan Kaprow (American, 1927–2006). [Sketches for illustrations for the program for *Loss*](/object-index/620/#fig-620-a), ca. 1973. Getty Research Institute, Allan Kaprow Papers, 980063, box 20, folder 13.

Allan Kaprow (American, 1927–2006). [Shooting script for 16mm film of *Comfort Zones*](/object-index/628/#fig-628-b), June 1975. Getty Research Institute, Allan Kaprow Papers, 980063, box 26, folder 7. 

Morton Feldman (American, 1926–87). [*Intersection 3* with a dedication to David Tudor](/object-index/012/), 1953. Getty Research Institute, David Tudor Papers, 980039, box 9, folder 1. *Intersection 3* by Morton Feldman © 1962 by C.F. Peters Corporation, New York. Permission by C.F. Peters Corporation. All rights reserved.

Morton Feldman (American, 1926–87). [*Intersection +*](/object-index/047/), 1953. Getty Research Institute, David Tudor Papers, 980039, box 9, folder 25. Permission by C.F. Peters Corporation. All rights reserved. 

[David Tudor’s copy of John Cage’s *Solo for Piano from Concert for Piano and Orchestra*](/object-index/060/#fig-060-an), 1957–58. Getty Research Institute, David Tudor Papers, 980039, box 176, folders 1, 2. Edition Peters.

Sylvano Bussotti (Italian, 1931–2021). [*Miscellaneous scores by Sylvano Bussotti sent to David Tudor*](/object-index/175/), early 1960s. Getty Research Institute, David Tudor Papers, 980039, box 51, folder 8. Used by permission of Hal Leonard.

{% endaccordion %}

</div>

{% endbackmatter %}
