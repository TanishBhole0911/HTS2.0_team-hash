# Mindmap Generator

This project is a FastAPI-based application that generates a hierarchical mindmap from a given text input. The mindmap is visualized and saved as an image locally.

## Features

- Generate a hierarchical structure for the given text.
- Visualize the generated mindmap.
- Save the mindmap as an image locally.

## Requirements

- Python 3.7+
- FastAPI
- Uvicorn
- Pydantic
- NetworkX
- Matplotlib
- dotenv
- Groq API key

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/mindmap-generator.git
   cd mindmap-generator
   ```

2. create a virtual environment:

   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the dependencies:

```sh
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory and add the following:

   ```sh
    GROQ_API_KEY=your_groq_api_key
   ```

5. Run the FastAPI application:

   ```sh
   uvicorn main:app --reload
   ```

6. POST request to `http://127.0.0.1:8000/create_mindmap` with the following JSON payload:
   eg:
   ```json
   {
     "content": "In Austria, the state of Lower Austria was affected the most, especially the central and northwestern regions, with the rivers Danube, Kamp and Traisen being the most problematic. Beforehand, most worries were focused on Ottenstein reservoir (which had to be hastily drained during the 2002 floods having added much to the damage).[6] Houses along these rivers had to be evacuated, among them the entire village of Rust im Tullnerfeld.[7] In Vienna, the Danube could be kept under control, but the Wien partly overflowed and areas in Penzing had to be evacuated.[8][9] Service on the Vienna U-Bahn was reduced drastically.[10] Burgenland, already struck by flooding in June, was under flood warning and suffered damages from storm winds and rain.[11] A dam failure in Sankt Pölten flooded the city.[10] In the Alpine regions, the heavy rains turned into snowfall, causing an extremely early onset of winter conditions. Further problems with the melting snow are expected. One person was buried by an avalanche on 13 September at Karwendel and remains missing. Rescue operations were hampered by severe weather. A secondary avalanche injured a rescuer.[12] On 15 September, a skier was found dead under a snowdrift in Untertauern.[13] Czech Republic Rescue boat in Ostrava, Czech Republic Floods in the Czech Republic began on 13 September after heavy rain.[14]As of 15 September, over 200 rivers were reported to have spilled over their banks.[15] The most critical situation was in North Moravia, especially in the region of the Jeseníky mountains, followed by Northeast Moravia where thousands of people had to be evacuated. Jeseník and Opava were among the worst hit places[16] where a few houses were destroyed by the overflown river. The evacuation operation there started already on the night of 14 and 15 September in the major residential area of Kateřinky. The biggest city hit by the floods was Ostrava.[16] There is an ongoing threat in parts of the South Bohemian Region. Four people were reported missing nationwide, thousands were displaced and around 250 thousand left without electricity.[17] Several roads and railroads were closed and water entered a station of the Prague Metro causing it to close, but the rest of the network remained operational.[18] Jeseník received nearly 500 mm (20 in) of rain. Parts of Moravia and Silesia exceeded 1997 flood rainfall totals.[19] On 15 September, Martin Kupka, the Czech transport minister, announced that railway operations in the Moravian-Silesian Region will remain suspended for at least a week to eliminate the damage caused by heavy rain and following floods.[20] On 15 and 16 September, four people died in the Moravian-Silesian Region. The first person died on 15 September in the Krasovka Stream. On 16 September, two people in Krnov and one in a flooded apartment were found dead.[21] A woman also drowned in Kobylá nad Vidnavkou.[22] The floods led the Interior Ministry to take direct control of organising voting for the 2024 Czech Senate election on 20 to 21 September in five severely affected towns, while in other areas, voting was held in tents, containers, or in open-air venues.[23] Italy Clearing operations in Sasso Marconi, near Bologna, Italy On 18 and 19 September, major flooding occurred in Emilia-Romagna, around the same areas affected by the deadly floods May 2023.[24] The rivers Marzeno and Lamone overflooded in Romagna, causing the evacuation of more than 1,000 people.[25] Several landslides occured in the Apennine Mountains area.[26][27][28][29] Important floods also occured in Marche region.[30] In the previous days, a hiker died from hypothermia in a snowstorm in the Italian Alps on 13 September.[31] On 17 September, a firefighter died in Foggia when his service car was swept away by a raging torrent on state road 90 connecting San Severo to Apricena.[32] That same day, a two-seater plane with three French nationals on board crashed into the Tuscan-Emilian Apennines due to bad weather.[33] Poland Overflowing river in Prudnik, Poland, 14 September Boris hovered over southwestern Poland, where it dropped almost half a year worth of rain during three days. Some places saw more than 400 mm (16 in) of torrential rainfall, accompanied by thunderstorms and tornadoes. Boris struck Opole Voivodeship and Lower Silesia, leading to flooding on 14–16 September. Ten people were reported dead as a result of the floods, with thousands displaced and between 50–70 thousand left without electricity.[34][35] Severe flooding alerts were reached in 82 measuring stations, primarily in the Oder river basin.[36] On 14 September, in the town of Głuchołazy, water overwhelmed flood barriers and destroyed a temporary bridge on the Biała Głuchołaska river, leading to mandatory evacuations.[37] Schools in Nysa, Kłodzko, Jelenia Góra and Prudnik were closed. Trains in the region were suspended due to multiple cases of track erosion and fallen trees.[38] Flooded Franciscan monastery complex in Kłodzko, Poland, 15 Septembe On 15 September, Prime Minister Donald Tusk declared a state of natural disaster.[39] Up to 2,600 people were evacuated from affected areas on that day alone.[40] Flood barriers failed in Kłodzko and Nysa, leading to flooding up to 150 cm (59 in) in the town centre of Kłodzko, with mayors calling for evacuation.[41][42] A dam in Międzygórze overflew and was deemed out of control by the Regional Water Management Board in Wrocław.[43] Later in the same evening, the dam in Stronie Śląskie failed, causing torrents strong enough to completely destroy homes.[44][45] The towns of Bystrzyca Kłodzka and Lądek-Zdrój and surrounding villages were also badly affected by the flood.[46] On the night of 15–16 September, the Pilchowice Dam overflowed, resulting in flooding of the towns of Lwówek Śląski, Gryfów Śląski and Wleń.[47][48] A Czech helicopter contingent stationed in Powidz, Poland, as part of NATO cooperation joined the relief operation in Poland.[49] On 17 September, the flood hit Lewin Brzeski which became one of the most affected towns with 90% of its total area flooded.[50] The same day, the flood wave reached Szprotawa, where authorities called for evacuations of parts of the town.[51] On the same day the wave reached Żagań, however, the embankments erected by firefighters, town residents, volunteers from neighboring settlements, and Polish and American soldiers stationed in the town, saved it from flooding.[52] Also that day, in Trzebień, Polish firefighters rescued two American soldiers who were swept away by the Bóbr River.[53] Romania Seven people were reported dead as the result of floods in Romania.[54][55] Galați and Vaslui Counties were severely impacted by the floods caused by Storm Boris, with multiple villages submerged, key infrastructure damaged, and thousands of residents displaced.[56][57] The region, bordered by the Siret and Prut Rivers, experienced relentless rainfall, which caused these rivers to overflow, wreaking havoc across the area. Several villages were overwhelmed by the flooding, including Slobozia Conachi, Cudalbi, Pechea, Costache Negri, Grivița, and Piscu. In these areas, streets turned into rivers, and homes were submerged under several feet of water. Residents were forced to evacuate, many using boats and makeshift rafts as floodwaters rose rapidly. Several local rivers breached their banks, turning farmlands and residential areas into flooded zones, further complicating rescue operations.[citation needed] Key roads such as DN25 and DN26, which connect rural areas to the city of Galați, were completely cut off, leaving emergency services struggling to reach affected areas. Landslides caused by the heavy rainfall further obstructed transport links, with 100 kilometres of the railway line between Bârlad and Galați closed due to severe damage with parts of the line suspended in mid-air.[58] Slovakia After a strong wind on the night of 14 to 15 September 2024, which was preceded by several days of heavy rains, water streams in Slovakia also rose. The worst hydrological situation occurred in the basins of the Kysuca and Myjava rivers as well as smaller rivers in the Little Carpathians. The Danube and Morava rivers also rose.[59] Rohožník, Jablonica, Stupava,[60] and Devínska Nová Ves were flooded during night and morning. The Blatina brook overflowed and flooded the parking lot and the underground of an apartment building in Sídlisko Sever II, Pezinok.[61][62] Orange and red Meteoalarm flood warnings were issued for Western Slovakia on 15 September.[59] At noon on 16 September, the level of the Danube reached a height of 926 centimeters and overflowed onto the Tyrš and Fajnor Embankments in Bratislava.[63] The Danube reached height of 970 centimeters on 17 September, at 2:30 a.m.,[64] at 7:00 a.m. the body of a 73-year-old man was found in the flooded basement of a family home in Devín borough,[3] and the level of Danube reached 966 centimeters at 10 a.m.[64] On 18 September, the level of the Danube and Morava in Bratislava peaked between 970 and 980 centimeters, in Devín it reached approximately 910 centimeters.[65] Although the city centre of Bratislava was mostly unscathed by the floods, several tram lines, the Bratislava Zoo and the Bratislavský lesný park sustained major damage.[66] Damages across the country were estimated at 20 million euros.[67] HungaryThe Little Danube in Esztergom, on 20 September at the Bottyán Bridge As of 17 September, 500 kilometres (310 mi) of the Danube is under flood warnings in preparation due to rising waters. In Budapest, the city government handed out 1 million sandbags to citizens. Train services between Budapest and Vienna were cancelled.[68] The lower half of Margaret Island was closed off.[69]"
   }
   ```
