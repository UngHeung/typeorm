import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { UserModel } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private tagRepository: Repository<TagModel>,
  ) {}

  @Post('/users')
  async createUser() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@email.com`,
      });
    }
  }

  @Get('/users')
  getUsers() {
    return this.userRepository.find({
      // relations: {
      //   posts: true,
      // },

      // 어떤 property를 선택할지 정할 수 있다.
      // default : 모든 프로퍼티
      // select : 정의된 프로퍼티
      // select: {
      //   id: true,
      //   createAt: true,
      //   updateAt: true,
      //   // relations: profile에서는 id만
      //   profile: {
      //     id: true,
      //   },
      // },
      // and는 같은 객체, or는 list로 객체들을 넣어주면 된다.
      where: {
        id: Not(8),
      },
      // // relations : user를 불러올 때 profile을 같이 가져온다.
      // relations: {
      //   profile: true,
      // },
      // // 오름차순(ASC), 내림차순(DESC)
      // order: {
      //   id: 'ASC', // 오름차순
      // },
      // // (정렬된 값을)앞에서부터 건너뛸 값
      // skip: 0, // default 0
      // take: 0, // default 0 - 0은 전부
    });
  }

  @Patch('/users/:id')
  async patchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: { id: +id },
    });
    return this.userRepository.save({
      ...user,
      email: `${user.email}`,
    });
  }

  @Delete('/users/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.userRepository.delete(id);
  }

  @Post('/users/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'profileTest@test.com',
      profile: {
        profileImg: 'profileTest.jpg',
      },
    });

    // const profile = await this.profileRepository.save({
    //   profileImg: 'test.jpg',
    //   user,
    // });

    return user;
  }

  @Delete('/user/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
  }

  @Post('/users/post')
  async createUserAndPost() {
    const user = await this.userRepository.save({
      email: 'postTest@test.com',
    });

    const post1 = await this.postRepository.save({
      author: user,
      title: 'post 1',
    });

    const post2 = await this.postRepository.save({
      author: user,
      title: 'post 2',
    });
  }

  @Post('/posts/tags')
  async createPostsTags() {
    const post1 = await this.postRepository.save({
      title: 'NestJS',
    });

    const post2 = await this.postRepository.save({
      title: 'Programming',
    });

    const tag1 = await this.tagRepository.save({
      name: 'JS',
      posts: [post1, post2],
    });

    const tag2 = await this.tagRepository.save({
      name: 'TS',
      posts: [post1],
    });

    const post3 = await this.postRepository.save({
      title: 'NextJS',
      tags: [tag1, tag2],
    });

    return true;
  }

  @Get('/posts')
  async getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('/tags')
  async getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }
}
