import {Metadata, FUNCTION_KEYS} from "../injector/metadata";
import {isEqual} from "../core";
import {IAction} from "../interfaces/iaction";

/**
 * Action decorator
 * @decorator
 * @function
 * @private
 * @name mapAction
 *
 * @param {String} type
 *
 * @description
 * Multiple action type providers
 */
let mapAction = (type) => (value: string): Function => {
  return (Class: Function, key: string, descriptor: PropertyDescriptor): Function => {
    let metadata: Array<any> = [];
    if (Metadata.hasMetadata(Class, FUNCTION_KEYS)) {
      metadata = Metadata.getMetadata(Class, FUNCTION_KEYS);
    }
    if (metadata.find(item => item.type === type && item.key === key)) {
      throw new TypeError(`Only one action definition is allowed on ${key} ${Metadata.getName(Class, "on class ")}`);
    } else if (!Metadata.isDescriptor(descriptor) && !isEqual(Class, descriptor)) {
      throw new TypeError(`@${type} is allowed ony on function type ${Metadata.getName(Class, "on class ")}`);
    }
    let iAction: IAction = {
      type,
      key,
      value
    };
    metadata.push(iAction);
    Metadata.defineMetadata(Class, FUNCTION_KEYS, metadata);
    if (Metadata.isDescriptor(descriptor)) {
      descriptor.configurable = false;
      descriptor.writable = false;
    }
    return Class;
  };
};
/**
 * Action decorator
 * @decorator
 * @function
 * @name Action
 *
 * @param {String} value
 *
 * @description
 * Define name of action to class
 */
export let Action = mapAction("Action");
/**
 * Before Action decorator
 * @decorator
 * @function
 * @name Before
 *
 * @param {String} value
 *
 * @description
 * Define name of before action to class
 */
export let Before = mapAction("Before");
/**
 * After Action decorator
 * @decorator
 * @function
 * @name After
 *
 * @param {String} value
 *
 * @description
 * Define name of after action to class
 */
export let After = mapAction("After");
