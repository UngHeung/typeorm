import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Repository } from 'typeorm';
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
  createUser() {
    return this.userRepository.save({
      // role: 'another role'
    });
  }

  @Get('/users')
  getUsers() {
    return this.userRepository.find({
      relations: {
        profile: true,
        posts: true,
      },
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
    });

    const profile = await this.profileRepository.save({
      profileImg: 'test.jpg',
      user,
    });

    return profile;
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
