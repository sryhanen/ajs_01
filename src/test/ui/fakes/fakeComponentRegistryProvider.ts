import {FakeComponent} from './fakeComponent';
import {COMPONENT_REGISTRY} from '../../../app/ui/angular2+/componentRegistry/componentRegistry';
import {FakeComponentRegistry} from './fakeComponentRegistry';

export const FakeComponentRegistryProvider = {provide: COMPONENT_REGISTRY, useValue:new Map([[FakeComponentRegistry.FAKE_COMPONENT, FakeComponent]])};
