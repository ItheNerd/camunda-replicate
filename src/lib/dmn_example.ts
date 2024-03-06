export function getHardcodedXmlString(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" xmlns:di="http://www.omg.org/spec/DMN/20180521/DI/" id="definitions_0o3juyk" name="definitions" namespace="http://camunda.org/schema/1.0/dmn" exporter="dmn-js (https://demo.bpmn.io/dmn)" exporterVersion="15.1.0">
    <decision id="decision_05bjlux" name="">
      <informationRequirement id="InformationRequirement_10j6tlo">
        <requiredInput href="#InputData_09bqcbb" />
      </informationRequirement>
      <decisionTable id="decisionTable_0o3zyf5">
        <input id="input1" label="">
          <inputExpression id="inputExpression1" typeRef="string">
            <text></text>
          </inputExpression>
        </input>
        <output id="output1" label="" name="" typeRef="string" />
      </decisionTable>
    </decision>
    <decision id="Decision_12jiewr">
      <informationRequirement id="InformationRequirement_13xfzij">
        <requiredDecision href="#decision_05bjlux" />
      </informationRequirement>
    </decision>
    <inputData id="InputData_09bqcbb" />
    <dmndi:DMNDI>
      <dmndi:DMNDiagram id="DMNDiagram_00s7w13">
        <dmndi:DMNShape id="DMNShape_0afhovx" dmnElementRef="decision_05bjlux">
          <dc:Bounds height="80" width="180" x="160" y="80" />
        </dmndi:DMNShape>
        <dmndi:DMNShape id="DMNShape_1vkezd5" dmnElementRef="Decision_12jiewr">
          <dc:Bounds height="80" width="180" x="390" y="80" />
        </dmndi:DMNShape>
        <dmndi:DMNShape id="DMNShape_0xdaqov" dmnElementRef="InputData_09bqcbb">
          <dc:Bounds height="45" width="125" x="188" y="228" />
        </dmndi:DMNShape>
        <dmndi:DMNEdge id="DMNEdge_08pjhv0" dmnElementRef="InformationRequirement_10j6tlo">
          <di:waypoint x="251" y="228" />
          <di:waypoint x="250" y="180" />
          <di:waypoint x="250" y="160" />
        </dmndi:DMNEdge>
        <dmndi:DMNEdge id="DMNEdge_16ccvh3" dmnElementRef="InformationRequirement_13xfzij">
          <di:waypoint x="340" y="120" />
          <di:waypoint x="370" y="120" />
          <di:waypoint x="390" y="120" />
        </dmndi:DMNEdge>
      </dmndi:DMNDiagram>
    </dmndi:DMNDI>
  </definitions>
  `;
}

// Usage example:
const xmlString = getHardcodedXmlString();
console.log(xmlString); // This will log the hardcoded XML string
