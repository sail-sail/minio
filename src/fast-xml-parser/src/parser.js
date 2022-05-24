import * as nodeToJson from "./node2json.js";
import * as xmlToNodeobj from "./xmlstr2xmlnode.js";
import * as x2xmlnode from "./xmlstr2xmlnode.js";
import { buildOptions } from "./util.js";
import * as validator from "./validator.js";

export const parse = function(xmlData, givenOptions = {}, validationOption) {
  if( validationOption){
    if(validationOption === true) validationOption = {}
    
    const result = validator.validate(xmlData, validationOption);
    if (result !== true) {
      throw Error( result.err.msg)
    }
  }
  if(givenOptions.parseTrueNumberOnly 
    && givenOptions.parseNodeValue !== false
    && !givenOptions.numParseOptions){
    
      givenOptions.numParseOptions = {
        leadingZeros: false,
      }
  }
  let options = buildOptions(givenOptions, x2xmlnode.defaultOptions, x2xmlnode.props);

  const traversableObj = xmlToNodeobj.getTraversalObj(xmlData, options)
  //print(traversableObj, "  ");
  return nodeToJson.convertToJson(traversableObj, options);
};
export { convert2nimn as convertTonimn } from "./nimndata.js";
// exports.convertTonimn = require('./nimndata').convert2nimn;
const getTraversalObj = xmlToNodeobj.getTraversalObj;
export { getTraversalObj }
const convertToJson = nodeToJson.convertToJson;
export { convertToJson }
export { convertToJsonString } from "./node2json_str.js"
// exports.convertToJsonString = require('./node2json_str').convertToJsonString;
const validate = validator.validate;
export { validate }
export { Parser as j2xParser } from "./json2xml.js";
// exports.j2xParser = require('./json2xml');

export const parseToNimn = function(xmlData, schema, options) {
  return convertTonimn(getTraversalObj(xmlData, options), schema, options);
};


function print(xmlNode, indentation){
  if(xmlNode){
    console.log(indentation + "{")
    console.log(indentation + "  \"tagName\": \"" + xmlNode.tagname + "\", ");
    if(xmlNode.parent){
      console.log(indentation + "  \"parent\": \"" + xmlNode.parent.tagname  + "\", ");
    }
    console.log(indentation + "  \"val\": \"" + xmlNode.val  + "\", ");
    console.log(indentation + "  \"attrs\": " + JSON.stringify(xmlNode.attrsMap,null,4)  + ", ");

    if(xmlNode.child){
      console.log(indentation + "\"child\": {")
      const indentation2 = indentation + indentation;
      Object.keys(xmlNode.child).forEach( function(key) {
        const node = xmlNode.child[key];

        if(Array.isArray(node)){
          console.log(indentation +  "\""+key+"\" :[")
          node.forEach( function(item,index) {
            //console.log(indentation + " \""+index+"\" : [")
            print(item, indentation2);
          })
          console.log(indentation + "],")  
        }else{
          console.log(indentation + " \""+key+"\" : {")
          print(node, indentation2);
          console.log(indentation + "},")  
        }
      });
      console.log(indentation + "},")
    }
    console.log(indentation + "},")
  }
}
