import React, { useEffect, useState, useRef } from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import "../styles/MindMap.css"; // Import the specific CSS file for MindMap

interface MindmapItem {
  key: string;
  category: string;
  text: string;
}

interface LinkData {
  from: string;
  to: string;
  text: string;
}

interface MindMapProps {
  nodeDataArray: MindmapItem[];
  linkDataArray: LinkData[];
}

const MindMap: React.FC<MindMapProps> = ({ nodeDataArray, linkDataArray }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const diagramRef = useRef<go.Diagram | null>(null);

  useEffect(() => {
    if (diagramRef.current) {
      diagramRef.current.model = new go.GraphLinksModel(
        nodeDataArray,
        linkDataArray
      );
    }
  }, [nodeDataArray, linkDataArray]);

  const initDiagram = (): go.Diagram => {
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, {
      "undoManager.isEnabled": true,
      model: $(go.GraphLinksModel, {
        linkKeyProperty: "key",
      }),
    });

    diagram.nodeTemplate = $(
      go.Node,
      "Auto",
      $(
        go.Shape,
        "RoundedRectangle",
        { strokeWidth: 0 },
        new go.Binding("fill", "category", (cat) => {
          switch (cat) {
            case "event":
              return "#FFCC00";
            case "location":
              return "#00CCFF";
            case "person":
              return "#FF99CC";
            case "group":
              return "#99CC00";
            default:
              return "#FFFFFF";
          }
        })
      ),
      $(
        go.TextBlock,
        { margin: 8, editable: true },
        new go.Binding("text", "text").makeTwoWay()
      )
    );

    diagram.linkTemplate = $(
      go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(
        go.TextBlock,
        { segmentOffset: new go.Point(0, -10) },
        new go.Binding("text", "text")
      )
    );

    return diagram;
  };

  const handleExpand = () => {
    setIsExpanded(true);
    document.body.classList.add("blur-background");
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    document.body.classList.remove("blur-background");
  };

  return (
    <>
      <div className="mindmap-section" onClick={handleExpand}>
        <h2>Mindmap</h2>
        <ReactDiagram
          initDiagram={initDiagram}
          divClassName="diagram-component"
          nodeDataArray={nodeDataArray}
          linkDataArray={linkDataArray}
          ref={diagramRef}
        />
      </div>
      {isExpanded && (
        <div className="overlay" onClick={handleCollapse}>
          <div
            className="expanded-mindmap"
            onClick={(e) => e.stopPropagation()}
          >
            <ReactDiagram
              initDiagram={initDiagram}
              divClassName="diagram-component"
              nodeDataArray={nodeDataArray}
              linkDataArray={linkDataArray}
              ref={diagramRef}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MindMap;
