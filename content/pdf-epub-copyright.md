---
layout: page
order: 4
classes:
  - scores-copyright-page
  - frontmatter
outputs:
  - epub
  - pdf
toc: false
---

{{ config.quire_credit_line | markdownify }}

{{ publication.description.online_edition }}

{% copyright %}

First edition {{ publication.pub_date | date: "%Y" }}
Any revisions or corrections made to this publication after the first edition date will be listed in detail in the project repository at [{{ publication.repository_url }}]({{ publication.repository_url }}). The revisions branch of the project repository, when present, will show any changes currently under consideration but not yet published here.

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
<div class="distribution">

Distributed in the United States and Canada by the University of Chicago Press

Distributed outside the United States and Canada by Yale University Press, London

Type composed in U001

Printed in China

</div>
<div class="cip-data">

{{ publication.library_of_congress_cip | markdownify }}

</div>
<div class="pub-info">

Every effort has been made to contact the owners and photographers of illustrations reproduced here whose names do not appear in the captions. Photographs and videos of items in the holdings of the Getty Research Institute are courtesy the Research Institute. Anyone having further information concerning copyright holders is asked to contact Getty Publications so this information can be included in future printings. 

This publication was peer reviewed through a single-masked process in which the reviewers remained anonymous.

</div>


