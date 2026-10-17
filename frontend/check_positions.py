html = open('insights/index.html', encoding='utf-8').read()

sections = [
    ('audience', '02 / WHO IT’S FOR'),
    ('journey-navigator', '03 / THE VENTURE JOURNEY'),
    ('library', '04 / RESOURCE LIBRARY'),
    ('action-flow', '05 / THE EXPERIMENTAL LOOP'),
    ('stories', '06 / FIELD LESSONS & STORIES'),
    ('learning-outcomes', '07 / CORE OUTCOMES'),
]

for sec_id, label in sections:
    pos = html.find(f'id="{sec_id}"')
    if pos != -1:
        # find the <section tag opening
        sec_start = html.rfind('<section', 0, pos)
        print(f"Found section {sec_id} at {pos}, tag at {sec_start}")
    else:
        print(f"NOT FOUND: {sec_id}")
