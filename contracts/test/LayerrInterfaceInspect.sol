// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.8.0 <0.9.0;


import {ILayerr20} from "../interfaces/ILayerr20.sol";
import {ILayerr721} from "../interfaces/ILayerr721.sol";
import {ILayerr721A} from "../interfaces/ILayerr721A.sol";
import {ILayerr1155} from "../interfaces/ILayerr1155.sol";
import {ILayerrToken} from "../interfaces/ILayerrToken.sol";
import {ILayerrRenderer} from "../interfaces/ILayerrRenderer.sol";

contract LayerrInterfaceInspect {

    function getLayerr20InterfaceId() external pure returns (bytes4) {
        return type(ILayerr20).interfaceId; 
    }

    function getLayerr721InterfaceId() external pure returns (bytes4) {
        return type(ILayerr721).interfaceId; 
    }

    function getLayerr721AInterfaceId() external pure returns (bytes4) {
        return type(ILayerr721A).interfaceId; 
    }

    function getLayerr1155InterfaceId() external pure returns (bytes4) {
        return type(ILayerr1155).interfaceId; 
    }

    function getLayerrTokenInterfaceId() external pure returns (bytes4) {
        return type(ILayerrToken).interfaceId; 
    }

    function getLayerrRendererInterfaceId() external pure returns (bytes4) {
        return type(ILayerrRenderer).interfaceId; 
    }

}