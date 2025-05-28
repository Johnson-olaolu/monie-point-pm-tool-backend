import { Global, Module } from '@nestjs/common';
import { ResendService } from './resend.service';
import { FirebaseModule } from './firebase/firebase.module';
import { MetaModule } from './meta/meta.module';

@Global()
@Module({
  imports: [FirebaseModule, MetaModule],
  providers: [ResendService],
  exports: [ResendService, FirebaseModule, MetaModule],
})
export class ServicesModule {}
