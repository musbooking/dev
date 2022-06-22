/// <reference path="vue-dts/vue.d.ts" />
/// <reference path="vue-webix.ts" />
// declarations
//import Vue, { ComponentOptions } from 'vue';
//export declare type VueClass<V> = {
//    new(...args: any[]): V & Vue;
//} & typeof Vue;
//export declare type DecoratedClass = VueClass<Vue> & {
//    __decorators__?: ((options: ComponentOptions<Vue>) => void)[];
//};
////import Vue, { ComponentOptions } from 'vue';
////import { VueClass } from './declarations';
//export declare const noop: () => void;
//export declare const hasProto: boolean;
//export interface VueDecorator {
//    (Ctor: typeof Vue): void;
//    (target: Vue, key: string): void;
//    (target: Vue, key: string, index: number): void;
//}
//export declare function createDecorator(factory: (options: ComponentOptions<Vue>, key: string, index: number) => void): VueDecorator;
//export declare function mixins<A>(CtorA: VueClass<A>): VueClass<A>;
//export declare function mixins<A, B>(CtorA: VueClass<A>, CtorB: VueClass<B>): VueClass<A & B>;
//export declare function mixins<A, B, C>(CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>): VueClass<A & B & C>;
//export declare function mixins<A, B, C, D>(CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>, CtorD: VueClass<D>): VueClass<A & B & C & D>;
//export declare function mixins<A, B, C, D, E>(CtorA: VueClass<A>, CtorB: VueClass<B>, CtorC: VueClass<C>, CtorD: VueClass<D>, CtorE: VueClass<E>): VueClass<A & B & C & D & E>;
//export declare function mixins<T>(...Ctors: VueClass<Vue>[]): VueClass<T>;
//export declare function isPrimitive(value: any): boolean;
//export declare function warn(message: string): void;
//// data
////import Vue from 'vue';
////import { VueClass } from './declarations';
//export declare function collectDataFromConstructor(vm: Vue, Component: VueClass<Vue>): {};
//// Component
////import Vue, { ComponentOptions } from 'vue';
////import { VueClass } from './declarations';
//export declare const $internalHooks: string[];
//export declare function componentFactory(Component: VueClass<Vue>, options?: ComponentOptions<Vue>): VueClass<Vue>;
//// properties
////import Vue, { PropOptions, WatchOptions } from 'vue';
////import Component from 'vue-class-component';
//import 'reflect-metadata';
//export declare type Constructor = {
//    new(...args: any[]): any;
//};
//export { Component, Vue };
///**
// * decorator of an inject
// * @param key key
// * @return PropertyDecorator
// */
//export declare function Inject(key?: string | symbol): PropertyDecorator;
///**
// * decorator of a provide
// * @param key key
// * @return PropertyDecorator | void
// */
//export declare function Provide(key?: string | symbol): PropertyDecorator;
///**
// * decorator of model
// * @param  event event name
// * @return PropertyDecorator
// */
//export declare function Model(event?: string, options?: (PropOptions | Constructor[] | Constructor)): PropertyDecorator;
///**
// * decorator of a prop
// * @param  options the options for the prop
// * @return PropertyDecorator | void
// */
//export declare function Prop(options?: (PropOptions | Constructor[] | Constructor)): PropertyDecorator;
///**
// * decorator of a watch function
// * @param  path the path or the expression to observe
// * @param  WatchOption
// * @return MethodDecorator
// */
//export declare function Watch(path: string, options?: WatchOptions): MethodDecorator;
///**
// * decorator of an event-emitter function
// * @param  event The name of the event
// * @return MethodDecorator
// */
//export declare function Emit(event?: string): MethodDecorator;
//# sourceMappingURL=_ref.js.map