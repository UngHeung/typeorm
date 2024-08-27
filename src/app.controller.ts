import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Between, Equal, ILike, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Not, Repository } from 'typeorm';
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
        // 아닌 값 가져오기
        // id: Not(8), // 8이 아닌 값
        // 적은 경우 가져오기
        // id: LessThan(10),
        // 적거나 같은 경우
        // id: LessThanOrEqual(10),
        // 큰경우
        // id: MoreThan(95),
        // 크거나 같은 경우
        // id: MoreThanOrEqual(95),
        // 같은 값 가져오기
        // id: Equal(30),
        id: Between(10, 15),

        // 유사값
        // email: Like('%1@%'),
        // email: Like('%eMail%'), // 대소문자를 구분한다.
        // email: ILike('%eMail%'), // 구분하지 않는다.
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
